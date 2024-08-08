const { auth } = require("express-oauth2-jwt-bearer");
const jwt = require("jsonwebtoken");

const authConfig = {
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
  issuerBaseURL: `https://${process.env.DOMAIN_AUTH0_DOCKER}`,
  jwtSecret: process.env.JWT_SECRET_DOCKER,
};

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: authConfig.issuerBaseURL,
});

const validateJwt = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { checkJwt, validateJwt };
