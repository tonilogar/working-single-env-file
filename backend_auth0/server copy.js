const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const axios = require("axios"); // Importa axios para manejar las solicitudes HTTP

/* const authConfig = require("./auth_config.json"); */

const app = express();

const authConfig = {
  domain: process.env.DOMAIN_AUTH0_DOCKER,
  clientId: process.env.CLIENT_ID_AUTH0_DOCKER,
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
};

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

// Endpoint para obtener las variables de entorno necesarias para el frontend
app.get('/config', (req, res) => {
  res.json({
    PORT_FRONTEND_01: process.env.VITE_PORT_FRONTEND_01_DOCKER,
    PORT_FRONTEND_02: process.env.VITE_PORT_FRONTEND_02_DOCKER,
    PORT_FRONTEND_03: process.env.VITE_PORT_FRONTEND_03_DOCKER,
    PORT_FRONTEND_04: process.env.VITE_PORT_FRONTEND_04_DOCKER,
    PORT_FRONTEND_05: process.env.VITE_PORT_FRONTEND_05_DOCKER,
    PORT_FRONTEND_06: process.env.VITE_PORT_FRONTEND_06_DOCKER,
    PORT_FRONTEND_07: process.env.VITE_PORT_FRONTEND_07_DOCKER,
    PORT_FRONTEND_08: process.env.VITE_PORT_FRONTEND_08_DOCKER,
    PORT_FRONTEND_09: process.env.VITE_PORT_FRONTEND_09_DOCKER,
    PORT_FRONTEND_10: process.env.VITE_PORT_FRONTEND_10_DOCKER,
    // Añade las variables que necesites
  });
});



if (!authConfig.domain || !authConfig.audience || !authConfig.clientId) {
  throw "Please make sure that variables are in place and populated";
}

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));




app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
  });
});


app.get("/auth_config",  (req, res) => {
  res.json({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
    audience: authConfig.audience,
  });
});


app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }

  next(err, req, res);
});

process.on("SIGINT", function() {
  process.exit();
});


module.exports = app;
