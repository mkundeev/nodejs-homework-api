const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./src/routes/api/contacts");
const usersRouter = require("./src/routes/api/users");

const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/services/openapi.json");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const passport = require("passport");
const strategy = require("./src/passport/passport");

// JWT Strategy
passport.use(strategy);

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/contacts", contactsRouter);
app.use("/users", usersRouter);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
