const { Router } = require("express");
const multer = require("multer");
const DishesController = require("../controllers/DishesController");
const DishesImgController = require("../controllers/DishesImgController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

const dishesRouter = Router();
const dishesController = new DishesController();
const dishesImgController = new DishesImgController();

dishesRouter.get(("/"), dishesController.index);
dishesRouter.get(("/:dish_id"), dishesController.show);
dishesRouter.post(("/"), ensureAuthenticated, dishesController.create);
dishesRouter.put(("/:dish_id"), dishesController.update);
dishesRouter.delete(("/:dish_id"), dishesController.delete);
dishesRouter.patch("/:dish_id", ensureAuthenticated, upload.single("img"), dishesImgController.update);

module.exports = dishesRouter;