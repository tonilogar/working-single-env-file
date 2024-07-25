const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el proyecto
const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  features: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Middleware para actualizar el campo `updatedAt` antes de guardar
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Crear el modelo basado en el esquema
const Project = mongoose.model('Project', projectSchema, 'projects');
module.exports = Project;
