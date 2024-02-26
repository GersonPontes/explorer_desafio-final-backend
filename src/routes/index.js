const { Router } = require("express");
const routes = Router();

const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const sessionsRouter = require("./sessions.routes");

routes.use(("/users"), usersRouter);
routes.use(("/dishes"), dishesRouter);
routes.use(("/sessions"), sessionsRouter);

module.exports = routes;