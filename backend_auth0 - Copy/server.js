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
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
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


app.post('/api/validate-token', checkJwt, (req, res) => {
  try {
    // Verificar si el encabezado Authorization existe y contiene el token JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).send({ msg: "Token no proporcionado o malformado." });
    }

    // Extraer el token JWT del encabezado Authorization
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(400).send({ msg: "Token no encontrado en el encabezado Authorization." });
    }

    // Log de depuración del token decodificado (ya validado por checkJwt)
    console.log('Token decodificado:', req.auth);

    // Opciones para la cookie, reutilizables en otras partes si es necesario
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día de duración
    };

    // Configurar y enviar la cookie con el token original
    res.cookie('access_token', token, cookieOptions);

    // Responder con un mensaje de éxito más informativo
    res.status(200).send({ msg: "Token validado y almacenado correctamente en la cookie." });

  } catch (error) {
    // Manejar cualquier error inesperado
    console.error("Error en /api/validate-token:", error);
    res.status(500).send({ msg: "Ocurrió un error al validar el token." });
  }
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
