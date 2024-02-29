const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

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
        .groupBy("dishes.id")
        .orderBy("dishes.name");
  
        if(dishes == ""){
          dishes = await knex("dishes")
          .where("category", category)
          .whereLike("name", `%${search}%`)
          .groupBy("id")
          .orderBy("name");
        }
  
      }else{
        dishes = await knex("dishes")
        .where("category", category)
        .groupBy("id")
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
        .groupBy("dishes.id")
        .orderBy("dishes.name");
  
        if(dishes == ""){
          dishes = await knex("dishes")
          .whereLike("name", `%${search}%`)
          .groupBy("id")
          .orderBy("name");
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

    return response.json({ ...dish, ingredients });
  };

  async create(request, response) {
    const { name, description, price, category, ingredients } = request.body;
    const user_id = request.user.id;
    
    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    };

    const [dish_id] = await knex("dishes").insert({
      name: name,
      description: description,
      price: price,
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

    return response.status(201).json(dish_id);
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
    const diskStorage = new DiskStorage();

    if(!dish) {
      throw new AppError("Prato não encontrado.");
    };

    await knex("dishes").where({ id: dish_id }).delete();

    await diskStorage.deleteFile(dish.image);

    return response.json();
  };
};

module.exports = DishesController;