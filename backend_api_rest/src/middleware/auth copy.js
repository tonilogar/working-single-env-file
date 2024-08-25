const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.DOMAIN_AUTH0_DOCKER}/.well-known/jwks.json`
  }),
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
  issuer: `https://${process.env.DOMAIN_AUTH0_DOCKER}/`,
  algorithms: ['RS256']
});

module.exports = authMiddleware;
