const mongoose = require("mongoose");

async function dbConnection() {
  return mongoose.connect(
    "mongodb+srv://Maksym:maksym13@cluster0.qzzubyj.mongodb.net?retryWrites=true&w=majority",
    { dbName: "db-contacts" }
  );
}

module.exports = {
  dbConnection,
};
