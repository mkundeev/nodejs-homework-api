const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnection() {
  return mongoose.connect(process.env.MONGO_URL, { dbName: "db-contacts" });
}

module.exports = {
  dbConnection,
};
