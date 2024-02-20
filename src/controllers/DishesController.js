const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class DishesController {
  async index(request, response){
    const { category, search } = request.query;

    let dishes;

    if(category){
      if(search){
        dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.description",
          "dishes.price",
          "dishes.image",
          "dishes.category"
        ])
        .where("dishes.category", category)
        .whereLike("ingredients.name", `%${search}%`)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .orderBy("dishes.name");
  
        if(dishes == ""){
          dishes = await knex("dishes")
          .whereLike("name", `%${search}%`);
        }
  
      }else{
        dishes = await knex("dishes")
        .where("category", category)
        .orderBy("name")
      };  
    } else {
      if(search){
        dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.description",
          "dishes.price",
          "dishes.image",
          "dishes.category"
        ])
        .whereLike("ingredients.name", `%${search}%`)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .orderBy("dishes.name");
  
        if(dishes == ""){
          dishes = await knex("dishes")
          .whereLike("name", `%${search}%`);
        }
  
      }else{
        dishes = await knex("dishes")
      };
    };

    return response.json(dishes);
  };

  async show(request, response){
    const { dish_id } = request.params;
    const dish = await knex("dishes").where({ id: dish_id }).first();

    if(!dish) {
      throw new AppError("Prato não encontrado.");
    };

    const ingredients = await knex("ingredients").where({ dish_id: dish_id }).orderBy("name");

    console.log(ingredients)

    return response.json({ ...dish, ingredients });
  };

  async create(request, response) {
    const { name, description, price, image, category, ingredients } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    };

    const [dish_id] = await knex("dishes").insert({
      name: name,
      description: description,
      price: price,
      image: image,
      category: category,
      user_id: user_id
    });

    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        name: ingredient,
        user_id: user_id,
        dish_id: dish_id
      }
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();
  };

  async update(request, response) {
    const { name, description, price, image, category, ingredients } = request.body;
    const { dish_id } = request.params;

    const dish = await knex("dishes").where({ id: dish_id }).first();
    if(!dish) {
      throw new AppError("Prato não encontrado.");
    };
    
    dish.name = name ?? dish.name;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.image = image ?? dish.image;
    dish.category = category ?? dish.category;

    const { update_dish } = await knex("dishes").where({ id: dish_id }).update({
      name: name,
      description: description,
      price: price,
      image: image,
      category: category,
      updated_at: knex.fn.now()
    });

    if(ingredients) {
      await knex("ingredients").where({ dish_id: dish_id }).delete();
    };

    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        name: ingredient,
        user_id: dish.user_id,
        dish_id: dish_id
      }
    });
    await knex("ingredients").insert(ingredientsInsert); 

    return response.status(200).json();
  };

  async delete(request, response) {
    const { dish_id } = request.params;
    const dish = await knex("dishes").where({ id: dish_id }).first();

    if(!dish) {
      throw new AppError("Prato não encontrado.");
    };

    await knex("dishes").where({ id: dish_id }).delete();

    return response.json();
  };
};

module.exports = DishesController;