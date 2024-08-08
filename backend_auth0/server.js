// Importa las dependencias necesarias
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const jwt = require("jsonwebtoken");

// Crea una instancia de la aplicación Express
const app = express();



// Configuración de autenticación obtenida de variables de entorno
const authConfig = {
  domain: process.env.DOMAIN_AUTH0_DOCKER,
  clientId: process.env.CLIENT_ID_AUTH0_DOCKER,
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
  clientSecret: process.env.CLIENT_SECRET_DOCKER,
  jwtSecret: process.env.JWT_SECRET_DOCKER,
};

// Verifica que todas las variables de entorno necesarias estén presentes
if (!authConfig.domain || !authConfig.audience || !authConfig.jwtSecret) {
  throw "Please make sure that variables are in place and populated";
}

// Usa morgan para registrar las solicitudes en modo de desarrollo
app.use(morgan("dev"));

// Usa helmet para ayudar a proteger la aplicación con varios encabezados HTTP
app.use(helmet());

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static(join(__dirname, "public")));

// Middleware para verificar JWT (JSON Web Token) en las solicitudes
const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

// Ruta para generar un token JWT
app.post('/generate_token', (req, res) => {
  const payload = {
    user: process.env.NICKNAME_AUTH0_DOCKER 
  };
  const token = jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
  res.json({ token });
});

// Ruta para obtener la configuración de autenticación, verificando primero el token JWT
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

/* Test para pasar una variable del fichero .env leerla con docker-compose y 
utilizarla en el html// 
Obtiene una variable de entorno de prueba */
const test_variable =  process.env.TEST_VARIABLE_DOCKER
// Ruta para obtener la variable de prueba, verificando primero el token JWT
app.get('/test_variable', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret); 
    res.json({ test_variable }); 
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Obtiene las variables de entorno necesarias
const envVariables = {
  VITE_PORT_FRONTEND_01_DOCKER: process.env.VITE_PORT_FRONTEND_01_DOCKER,
  VITE_PORT_FRONTEND_02_DOCKER: process.env.VITE_PORT_FRONTEND_02_DOCKER
};

app.get('/env_variables', (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  try {
    if (!token) throw new Error('No token provided');
    jwt.verify(token, authConfig.jwtSecret);
    res.json(envVariables);
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Ruta protegida por JWT que responde con un mensaje de validación exitosa
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
  });
});

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
