const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if(!name) {
      throw new AppError("Nome obrigatório");
    };

    if(!email) {
      throw new AppError("E-mail obrigatório");
    };

    if(!password) {
      throw new AppError("Senha obrigatória");
    };

    const checkUserExists = await knex("users").where({ email: email }).first();

    if(checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    };

    const hashedPassword = await hash(password,8);

    const { user_id } = await knex("users").insert({
      name: name,
      email: email,
      password: hashedPassword
    });
  
    response.status(201).json();
  };
};

module.exports = UsersController;