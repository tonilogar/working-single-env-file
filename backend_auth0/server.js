const express = require("express");
const { join } = require("path");
const { configureMiddleware } = require("./src/config/config");
const routes = require("./src/routes/routes");

const app = express();
configureMiddleware(app);

app.use(express.static(join(__dirname, "public")));
app.use(routes);

// Middleware de manejo de errores para errores de autorización
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }
  next(err, req, res);
});

// Manejador para la señal SIGINT, usado para cerrar la aplicación de forma ordenada
process.on("SIGINT", function() {
  process.exit();
});

// Redirige todas las demás rutas a la página principal
app.get('*', (req, res) => {
  res.redirect('/');
});

// Exporta la instancia de la aplicación para su uso en otros módulos
module.exports = app;
