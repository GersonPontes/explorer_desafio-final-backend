require("express-async-errors");
require("dotenv/config");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const PORT = process.env.SERVER_PORT || 3333;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://foodexplorergpo.netlify.app"],
  credentials: true
}));

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