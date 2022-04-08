const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const url = process.env.MONGO_URI;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const conn = mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

module.export = conn;
