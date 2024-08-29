const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const cors = require("cors"); 
const cookieParser = require('cookie-parser'); // Importa cookie-parser
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cookieParser()); // Usa cookie-parser

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true 
};
app.use(cors(corsOptions));

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
  });
});

if (!authConfig.domain || !authConfig.audience || !authConfig.clientId) {
  throw "Please make sure that variables are in place and populated";
}

app.post("/api/store-token", checkJwt, (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send({ msg: "Token is required" });
  }

  // Configurar y enviar la cookie
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000 
  });

  res.status(200).send({ msg: "Token almacenado correctamente" });
});

app.get('/check-token', checkJwt, (req, res) => {
  // Imprimir todas las cookies que se reciben con la solicitud
  console.log("Cookies recibidas:", req.cookies);
  console.log("access_token recibido:", req.cookies.access_token);

  if (req.cookies.access_token) {
    console.log("Access Token recibido:", req.cookies.access_token);
    res.status(200).send({ msg: "Token válido." });
  } else {
    console.log("No se encontró la cookie 'access_token'.");
    res.status(401).send({ msg: "Token no encontrado o inválido." });
  }
});

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

/* app.post('/api/validate-token', checkJwt, (req, res) => {
  // Si llegas aquí, el token ya ha sido validado correctamente por checkJwt

  // No necesitas el token en el body porque ya está validado en req.auth
  console.log('Token validado y decodificado:', req.auth);

  // Crear la cookie si el token es válido
  res.cookie('access_token', req.auth, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 día de duración (ajustable)
  });

  res.status(200).send({ msg: "Token validado correctamente y cookie creada." });
}); */
app.post('/api/validate-token', checkJwt, (req, res) => {
  // Si llegas aquí, el token ya ha sido validado correctamente por checkJwt

  // Aquí, req.auth contiene el token decodificado, pero necesitas el JWT original
  const token = req.headers.authorization.split(' ')[1]; // Extrae el JWT original

  // No necesitas el token decodificado en el body porque ya está validado en req.auth
  console.log('Token validado y decodificado:', req.auth);

  // Crear la cookie con el token original si es válido
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 día de duración (ajustable)
  });

  res.status(200).send({ msg: "Token validado correctamente y cookie creada." });
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
