const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Verificar que las variables de entorno estén configuradas
console.log('DOMAIN_AUTH0_DOCKER:', process.env.DOMAIN_AUTH0_DOCKER);
console.log('AUDIENCE_AUTH0_DOCKER:', process.env.AUDIENCE_AUTH0_DOCKER);

const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.DOMAIN_AUTH0_DOCKER}/.well-known/jwks.json`
  }),
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
  issuer: `https://${process.env.DOMAIN_AUTH0_DOCKER}/`,
  algorithms: ['RS256'],
  getToken: (req) => {
    // Extraer el token desde la cookie llamada 'access_token'
    const token = req.cookies.access_token;
    console.log('Token extraído de la cookie:', token); // Verificar el token
    return token;
  }
});

// Middleware de manejo de errores de autenticación
const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error('Error de autenticación:', err); // Imprimir detalles del error
    res.status(401).json({ message: 'Token inválido o no proporcionado' });
  } else {
    next(err);
  }
};

module.exports = { authMiddleware, errorHandler };
