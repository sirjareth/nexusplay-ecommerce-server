// Setup Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { errorHandler } = require("./auth");

const userRoute = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

app.use("/users", userRoute);
app.use(errorHandler);

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${process.env.PORT || 3000}`);
  });
}





module.exports = { app, mongoose };
