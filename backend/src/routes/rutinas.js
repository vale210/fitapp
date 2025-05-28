const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/rutinas.json');

// Obtener rutinas
const getRutinas = async () => {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Guardar rutinas
const saveRutinas = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// Obtener todas las rutinas
router.get('/', async (req, res) => {
    try {
        const data = await getRutinas();
        res.json(data.rutinas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener rutinas' });
    }
});

// Obtener rutina por ID
router.get('/:id', async (req, res) => {
    try {
        const { rutinas } = await getRutinas();
        const rutina = rutinas.find(r => r.id === req.params.id);
        
        if (!rutina) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }
        
        res.json(rutina);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener rutina' });
    }
});

// Crear nueva rutina
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, nivel, duracion, dias_semana, ejercicios } = req.body;
        const data = await getRutinas();
        
        const newRutina = {
            id: String(data.rutinas.length + 1),
            nombre,
            descripcion,
            nivel,
            duracion,
            dias_semana,
            ejercicios
        };
        
        data.rutinas.push(newRutina);
        await saveRutinas(data);
        
        res.status(201).json(newRutina);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear rutina' });
    }
});

// Actualizar rutina
router.put('/:id', async (req, res) => {
    try {
        const data = await getRutinas();
        const index = data.rutinas.findIndex(r => r.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }
        
        data.rutinas[index] = {
            ...data.rutinas[index],
            ...req.body,
            id: req.params.id
        };
        
        await saveRutinas(data);
        res.json(data.rutinas[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar rutina' });
    }
});

// Eliminar rutina
router.delete('/:id', async (req, res) => {
    try {
        const data = await getRutinas();
        data.rutinas = data.rutinas.filter(r => r.id !== req.params.id);
        await saveRutinas(data);
        res.json({ message: 'Rutina eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar rutina' });
    }
});

module.exports = router; 