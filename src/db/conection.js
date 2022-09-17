const mongoose = require("mongoose");

async function dbConnection() {
  return mongoose.connect(MONGO_URL, { dbName: "db-contacts" });
}

module.exports = {
  dbConnection,
};
