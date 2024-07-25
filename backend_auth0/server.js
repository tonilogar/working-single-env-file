const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const jwt = require("jsonwebtoken");


const app = express();
const test_variable =  process.env.TEST_VARIABLE_DOCKER
/* Leemos las variables creadas en docker-compose para el contenedor backend_auth */
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

// Ruta para generar un token JWT
app.post('/generate_token', (req, res) => {
  const payload = {
    user: 'your-user-id' // Usa datos relevantes
  };
  const token = jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
  res.json({ token });
});

// Ruta para entregar las configuraciones de Auth0 con un token de acceso
app.get('/auth_config', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret); // Asegúrate de tener un secreto JWT configurado
    res.json({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      audience: authConfig.audience
    });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/test_variable', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret); // Verifica el token JWT
    res.json({ test_variable }); // Responde con test_variable
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
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

// Redirige todas las rutas no reconocidas a la raíz
app.get('*', (req, res) => {
  res.redirect('/');
});
module.exports = app;
