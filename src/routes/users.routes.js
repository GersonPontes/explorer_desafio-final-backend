const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
//const UsersValidatedController = require("../controllers/UsersValidatedController");

const usersRouter = Router();
const usersController = new UsersController();
//const usersValidatedController = new UsersValidatedController();

usersRouter.post(("/"), usersController.create);
//usersRouter.get(("/validated/:user_id"), usersValidatedController.index);

module.exports = usersRouter;