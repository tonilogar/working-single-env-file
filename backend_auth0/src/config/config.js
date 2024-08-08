const morgan = require("morgan");
const helmet = require("helmet");

const configureMiddleware = (app) => {
  app.use(morgan("dev"));
  app.use(helmet());
};

module.exports = { configureMiddleware };
