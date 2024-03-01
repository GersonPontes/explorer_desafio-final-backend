const { Router } = require("express");
const multer = require("multer");
const DishesController = require("../controllers/DishesController");
const DishesImgController = require("../controllers/DishesImgController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

const dishesRouter = Router();
const dishesController = new DishesController();
const dishesImgController = new DishesImgController();

dishesRouter.get(("/"), ensureAuthenticated, dishesController.index);
dishesRouter.get(("/:dish_id"), ensureAuthenticated, dishesController.show);
dishesRouter.post(("/"), ensureAuthenticated, verifyUserAuthorization("admin"), dishesController.create);
dishesRouter.put(("/:dish_id"), ensureAuthenticated, verifyUserAuthorization("admin"), dishesController.update);
dishesRouter.delete(("/:dish_id"), ensureAuthenticated, verifyUserAuthorization("admin"), dishesController.delete);
dishesRouter.patch("/:dish_id", ensureAuthenticated, verifyUserAuthorization("admin"), upload.single("dishImg"), dishesImgController.update);

module.exports = dishesRouter;