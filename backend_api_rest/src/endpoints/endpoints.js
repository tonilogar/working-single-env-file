const express = require('express');
const router = express.Router();

// Importar rutas
const projectsRoutes = require('../routes/projects-routes');

router.use('/projects', projectsRoutes);

module.exports = router;
