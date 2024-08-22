const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects-controller');
const authMiddleware = require('../middleware/auth');


// Acciones CRUD
router.get('/', authMiddleware, projectsController.getAllProjects);
router.get('/:id', authMiddleware, projectsController.getProjectById);
router.post('/', authMiddleware, projectsController.addProject);
router.put('/:id', authMiddleware, projectsController.updateProject);
router.delete('/:id', authMiddleware, projectsController.deleteProject);

module.exports = router;
