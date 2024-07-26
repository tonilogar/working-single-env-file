const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const test_variable =  process.env.TEST_VARIABLE_DOCKER

const authConfig = {
  domain: process.env.DOMAIN_AUTH0_DOCKER,
  clientId: process.env.CLIENT_ID_AUTH0_DOCKER,
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
  clientSecret: process.env.CLIENT_SECRET_DOCKER,
  jwtSecret: process.env.JWT_SECRET_DOCKER,
};

if (!authConfig.domain || !authConfig.audience || !authConfig.jwtSecret) {
  throw "Please make sure that variables are in place and populated";
}

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

// Ruta de registro de usuario
app.post('/register', (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: 'User ID and email are required' });
  }

  // Imprimir los datos del usuario
  console.log('User ID:', userId);
  console.log('Email:', email);

  const payload = { userId, email };
  const token = jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });

  // Enviar el token de vuelta al cliente
  res.json({ token });
});

// Ruta para obtener la configuración de Auth0
app.get('/auth_config', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret);
    res.json({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      audience: authConfig.audience
    });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Ruta para obtener la variable de prueba
app.get('/test_variable', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret);
    res.json({ test_variable });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Ruta protegida que verifica el token JWT
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
  });
});

// Middleware de manejo de errores
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }
  next(err, req, res);
});

// Manejo de la señal SIGINT para cerrar la aplicación
process.on("SIGINT", function() {
  process.exit();
});

// Redirige todas las rutas no reconocidas a la raíz
app.get('*', (req, res) => {
  res.redirect('/');
});



module.exports = app;
