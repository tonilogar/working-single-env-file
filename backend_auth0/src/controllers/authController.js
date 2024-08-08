const jwt = require("jsonwebtoken");

const authConfig = {
  domain: process.env.DOMAIN_AUTH0_DOCKER,
  clientId: process.env.CLIENT_ID_AUTH0_DOCKER,
  audience: process.env.AUDIENCE_AUTH0_DOCKER,
  clientSecret: process.env.CLIENT_SECRET_DOCKER,
  jwtSecret: process.env.JWT_SECRET_DOCKER,
};

const checkJwt = require("express-oauth2-jwt-bearer").auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

const generateToken = (req, res) => {
  const payload = { user: process.env.NICKNAME_AUTH0_DOCKER };
  const token = jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
  res.json({ token });
};

const getAuthConfig = (req, res) => {
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
};

const getTestVariable = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, authConfig.jwtSecret);
    res.json({ test_variable: process.env.TEST_VARIABLE_DOCKER });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const getEnvVariables = (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  try {
    if (!token) throw new Error('No token provided');
    jwt.verify(token, authConfig.jwtSecret);
    res.json({
      VITE_PORT_FRONTEND_01_DOCKER: process.env.VITE_PORT_FRONTEND_01_DOCKER,
      VITE_PORT_FRONTEND_02_DOCKER: process.env.VITE_PORT_FRONTEND_02_DOCKER
    });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const validateToken = (req, res) => {
  res.send({ msg: "Your access token was successfully validated!" });
};

module.exports = { checkJwt, generateToken, getAuthConfig, getTestVariable, getEnvVariables, validateToken };
