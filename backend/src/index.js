const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/users');
const ejerciciosRoutes = require('./routes/ejercicios');
const rutinasRoutes = require('./routes/rutinas');
const progresoRoutes = require('./routes/progreso');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public/ejercicios', express.static(path.join(__dirname, 'public/ejercicios')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/rutinas', rutinasRoutes);
app.use('/api/progreso', progresoRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); 