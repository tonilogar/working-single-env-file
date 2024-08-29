const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects-controller');

const { authMiddleware, errorHandler } = require('../middleware/auth');

// Acciones CRUD

router.get('/', authMiddleware, projectsController.getAllProjects);
router.get('/:id', authMiddleware, projectsController.getProjectById);
router.post('/', authMiddleware, projectsController.addProject);
router.put('/:id', authMiddleware, projectsController.updateProject);
router.delete('/:id', authMiddleware, projectsController.deleteProject); 

/* router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);
router.post('/', projectsController.addProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject); */

module.exports = router;
