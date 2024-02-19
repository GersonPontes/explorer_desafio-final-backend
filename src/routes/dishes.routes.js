const { Router } = require("express");
const DishesController = require("../controllers/DishesController");

const dishesRouter = Router();
const dishesController = new DishesController();

dishesRouter.get(("/"), dishesController.index);
dishesRouter.get(("/:dish_id"), dishesController.show);
dishesRouter.post(("/:user_id"), dishesController.create);
dishesRouter.put(("/:dish_id"), dishesController.update);
dishesRouter.delete(("/:dish_id"), dishesController.delete);

module.exports = dishesRouter;