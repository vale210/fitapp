const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/progreso.json');

// Obtener progreso
const getProgreso = async () => {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Guardar progreso
const saveProgreso = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// Obtener progreso de un usuario
router.get('/usuario/:userId', async (req, res) => {
    try {
        const { progreso } = await getProgreso();
        const progresoUsuario = progreso.filter(p => p.usuario_id === req.params.userId);
        res.json(progresoUsuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener progreso' });
    }
});

// Registrar nuevo progreso
router.post('/', async (req, res) => {
    try {
        const { usuario_id, tipo, valor, unidad, ejercicio_id, peso, series, repeticiones } = req.body;
        const data = await getProgreso();
        
        const newProgreso = {
            id: String(data.progreso.length + 1),
            usuario_id,
            fecha: new Date().toISOString().split('T')[0],
            tipo,
            ...(tipo === 'peso' ? { valor, unidad } : { ejercicio_id, peso, series, repeticiones })
        };
        
        data.progreso.push(newProgreso);
        await saveProgreso(data);
        
        res.status(201).json(newProgreso);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar progreso' });
    }
});

// Obtener estadísticas de progreso
router.get('/estadisticas/:userId', async (req, res) => {
    try {
        const { progreso } = await getProgreso();
        const progresoUsuario = progreso.filter(p => p.usuario_id === req.params.userId);
        
        // Estadísticas de peso
        const pesoCorporal = progresoUsuario
            .filter(p => p.tipo === 'peso')
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        // Estadísticas de ejercicios
        const ejercicios = progresoUsuario
            .filter(p => p.tipo === 'ejercicio')
            .reduce((acc, curr) => {
                if (!acc[curr.ejercicio_id]) {
                    acc[curr.ejercicio_id] = [];
                }
                acc[curr.ejercicio_id].push(curr);
                return acc;
            }, {});
        
        res.json({
            pesoCorporal: pesoCorporal[0] || null,
            ejercicios
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
});

module.exports = router; 