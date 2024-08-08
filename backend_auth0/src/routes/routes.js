const express = require("express");
const { checkJwt, validateJwt } = require("../middlewares/authMiddleware");
const { generateToken, getAuthConfig, getTestVariable, getEnvVariables, validateToken } = require("../controllers/authController");

const router = express.Router();

router.post('/generate_token', generateToken);
router.get('/auth_config', validateJwt, getAuthConfig);
router.get('/test_variable', validateJwt, getTestVariable);
router.get('/env_variables', validateJwt, getEnvVariables);
router.get("/api/external", checkJwt, validateToken);

module.exports = router;
