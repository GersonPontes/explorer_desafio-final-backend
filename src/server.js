require("express-async-errors");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const PORT = 3333;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

app.use((error, request, response, next) => {

  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
  
});

app.listen(PORT, () => console.log(`server os running in ${PORT}`));