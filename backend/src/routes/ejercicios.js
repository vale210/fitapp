const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const DB_PATH = path.join(__dirname, '../data/ejercicios.json');

// Configurar multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/ejercicios');
        // Crear el directorio si no existe
        fs.mkdir(uploadPath, { recursive: true })
            .then(() => cb(null, uploadPath))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        // Generar nombre único usando timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Validar tipos de archivo
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif)'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

// Obtener ejercicios
const getEjercicios = async () => {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Guardar ejercicios
const saveEjercicios = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// Obtener todos los ejercicios
router.get('/', async (req, res) => {
    try {
        const data = await getEjercicios();
        res.json(data.ejercicios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ejercicios' });
    }
});

// Obtener ejercicio por ID
router.get('/:id', async (req, res) => {
    try {
        const { ejercicios } = await getEjercicios();
        const ejercicio = ejercicios.find(e => e.id === req.params.id);
        
        if (!ejercicio) {
            return res.status(404).json({ message: 'Ejercicio no encontrado' });
        }
        
        res.json(ejercicio);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ejercicio' });
    }
});

// Crear nuevo ejercicio
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'La imagen es requerida' });
        }

        const { nombre, categoria, descripcion, musculos, nivel } = req.body;
        const data = await getEjercicios();
        
        const newEjercicio = {
            id: String(data.ejercicios.length + 1),
            nombre,
            categoria,
            descripcion,
            imagen: req.file.filename,
            musculos: typeof musculos === 'string' ? JSON.parse(musculos) : musculos,
            nivel
        };
        
        data.ejercicios.push(newEjercicio);
        await saveEjercicios(data);
        
        res.status(201).json(newEjercicio);
    } catch (error) {
        // Si hay error, eliminar la imagen subida
        if (req.file) {
            const filePath = path.join(__dirname, '../public/ejercicios', req.file.filename);
            fs.unlink(filePath).catch(err => console.error('Error al eliminar imagen:', err));
        }
        res.status(500).json({ message: 'Error al crear ejercicio' });
    }
});

// Actualizar ejercicio
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const data = await getEjercicios();
        const index = data.ejercicios.findIndex(e => e.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Ejercicio no encontrado' });
        }

        const oldImage = data.ejercicios[index].imagen;
        const { nombre, categoria, descripcion, musculos, nivel } = req.body;
        
        data.ejercicios[index] = {
            ...data.ejercicios[index],
            nombre: nombre || data.ejercicios[index].nombre,
            categoria: categoria || data.ejercicios[index].categoria,
            descripcion: descripcion || data.ejercicios[index].descripcion,
            musculos: musculos ? (typeof musculos === 'string' ? JSON.parse(musculos) : musculos) : data.ejercicios[index].musculos,
            nivel: nivel || data.ejercicios[index].nivel,
            imagen: req.file ? req.file.filename : oldImage
        };

        if (req.file && oldImage) {
            // Eliminar imagen anterior
            const oldImagePath = path.join(__dirname, '../public/ejercicios', oldImage);
            fs.unlink(oldImagePath).catch(err => console.error('Error al eliminar imagen anterior:', err));
        }
        
        await saveEjercicios(data);
        res.json(data.ejercicios[index]);
    } catch (error) {
        if (req.file) {
            const filePath = path.join(__dirname, '../public/ejercicios', req.file.filename);
            fs.unlink(filePath).catch(err => console.error('Error al eliminar imagen:', err));
        }
        res.status(500).json({ message: 'Error al actualizar ejercicio' });
    }
});

// Eliminar ejercicio
router.delete('/:id', async (req, res) => {
    try {
        const data = await getEjercicios();
        const ejercicio = data.ejercicios.find(e => e.id === req.params.id);
        
        if (!ejercicio) {
            return res.status(404).json({ message: 'Ejercicio no encontrado' });
        }

        if (ejercicio.imagen) {
            // Eliminar imagen asociada
            const imagePath = path.join(__dirname, '../public/ejercicios', ejercicio.imagen);
            await fs.unlink(imagePath).catch(err => console.error('Error al eliminar imagen:', err));
        }
        
        data.ejercicios = data.ejercicios.filter(e => e.id !== req.params.id);
        await saveEjercicios(data);
        
        res.json({ message: 'Ejercicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar ejercicio' });
    }
});

module.exports = router; 