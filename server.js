const app = require("./app");
require("dotenv").config();
const { dbConnection } = require("./src/db/conection");

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await dbConnection();
    console.log("Database connection successful");
    console.log(`Server running. Use our API on port: ${PORT}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
});
