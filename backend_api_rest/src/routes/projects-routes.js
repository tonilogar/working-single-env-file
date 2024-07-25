const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects-controller');

// Acciones CRUD
router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);
router.post('/', projectsController.addProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
