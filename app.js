const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./Middleware/error.js");
const userRouter = require("./Routes/userRoutes.js");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/api", userRouter);

//Middleware for error
app.use(errorMiddleware);

module.exports = app;
