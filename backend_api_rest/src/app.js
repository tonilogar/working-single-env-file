const express = require('express');
const app = express();
const connectToMongoDB = require('./database/mongo-db');
const apiRoutes = require('./endpoints/endpoints');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importa cookie-parser



const port = process.env.PORT_BACKEND_API_REST_DOCKER || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Cambia esto si usas otras URLs o puertos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// Middleware para analizar cookies
app.use(cookieParser()); // Añade cookie-parser aquí



app.use('/api', apiRoutes);

// MongoDB connection
connectToMongoDB().catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});



// Ruta para la raíz
app.get('/', (req, res) => {
  res.send(`Hola mundo servidor escuchando en http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
