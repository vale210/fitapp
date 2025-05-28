const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DB_PATH = path.join(__dirname, '../data/users.json');
const PROGRESO_PATH = path.join(__dirname, '../data/progreso.json');

// Leer usuarios
const getUsers = async () => {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Guardar usuarios
const saveUsers = async (users) => {
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
};

// Leer progreso
const getProgreso = async () => {
    const data = await fs.readFile(PROGRESO_PATH, 'utf8');
    return JSON.parse(data);
};

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { users } = await getUsers();
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            'tu_secreto_jwt',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { ...user, password: undefined } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Registro
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const data = await getUsers();
        
        if (data.users.some(u => u.email === email)) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const newUser = {
            id: String(data.users.length + 1),
            nombre,
            email,
            password,
            rol: 'cliente',
            estado: 'activo',
            fechaRegistro: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString()
        };

        data.users.push(newUser);
        await saveUsers(data);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, rol: newUser.rol },
            'tu_secreto_jwt',
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, user: { ...newUser, password: undefined } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener estadísticas de usuarios
router.get('/estadisticas', async (req, res) => {
    try {
        const { users } = await getUsers();
        const progreso = await getProgreso();

        const fechaActual = new Date();
        const unMesAtras = new Date(fechaActual.setMonth(fechaActual.getMonth() - 1));

        const estadisticas = {
            totalUsuarios: users.filter(u => u.rol === 'cliente').length,
            usuariosActivos: users.filter(u => u.estado === 'activo' && u.rol === 'cliente').length,
            usuariosNuevos: users.filter(u => 
                new Date(u.fechaRegistro) > unMesAtras && 
                u.rol === 'cliente'
            ).length,
            usuariosInactivos: users.filter(u => u.estado === 'inactivo' && u.rol === 'cliente').length,
            progresoPromedio: calcularProgresoPromedio(progreso.progreso),
            asistenciaSemanal: calcularAsistenciaSemanal(progreso.progreso),
            objetivosCumplidos: calcularObjetivosCumplidos(progreso.progreso)
        };

        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
});

// Cambiar estado de usuario (activar/desactivar)
router.patch('/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const data = await getUsers();
        
        const userIndex = data.users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (data.users[userIndex].rol === 'admin') {
            return res.status(403).json({ message: 'No se puede modificar el estado del administrador' });
        }

        data.users[userIndex].estado = estado;
        data.users[userIndex].ultimaModificacion = new Date().toISOString();

        await saveUsers(data);
        res.json({ user: { ...data.users[userIndex], password: undefined } });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar estado del usuario' });
    }
});

// Obtener historial de usuario
router.get('/:id/historial', async (req, res) => {
    try {
        const { id } = req.params;
        const progreso = await getProgreso();
        
        const historialUsuario = progreso.progreso.filter(p => p.usuario_id === id);
        
        res.json(historialUsuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener historial' });
    }
});

// Funciones auxiliares para estadísticas
function calcularProgresoPromedio(progreso) {
    if (!progreso.length) return 0;
    const progresos = progreso.filter(p => p.tipo === 'peso');
    if (!progresos.length) return 0;
    
    return progresos.reduce((acc, curr) => acc + curr.valor, 0) / progresos.length;
}

function calcularAsistenciaSemanal(progreso) {
    const fechaActual = new Date();
    const unaSemanaAtras = new Date(fechaActual.setDate(fechaActual.getDate() - 7));
    
    return progreso.filter(p => new Date(p.fecha) > unaSemanaAtras).length;
}

function calcularObjetivosCumplidos(progreso) {
    const objetivos = progreso.filter(p => p.tipo === 'objetivo');
    if (!objetivos.length) return 0;
    
    const cumplidos = objetivos.filter(o => o.cumplido).length;
    return (cumplidos / objetivos.length) * 100;
}

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const { users } = await getUsers();
        res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password } = req.body;
        const data = await getUsers();
        
        const userIndex = data.users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el email ya existe en otro usuario
        const emailExists = data.users.some(u => u.email === email && u.id !== id);
        if (emailExists) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        // Actualizar usuario
        data.users[userIndex] = {
            ...data.users[userIndex],
            nombre: nombre || data.users[userIndex].nombre,
            email: email || data.users[userIndex].email,
            password: password || data.users[userIndex].password
        };

        await saveUsers(data);
        res.json({ user: { ...data.users[userIndex], password: undefined } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getUsers();
        
        const userIndex = data.users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que no sea el admin
        if (data.users[userIndex].rol === 'admin') {
            return res.status(403).json({ message: 'No se puede eliminar al administrador' });
        }

        data.users = data.users.filter(u => u.id !== id);
        await saveUsers(data);
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener progreso personal del usuario
router.get('/:id/progreso-personal', async (req, res) => {
    try {
        const { id } = req.params;
        const progreso = await getProgreso();
        
        // Obtener últimos 7 días de progreso
        const fechaActual = new Date();
        const unaSemanaAtras = new Date(fechaActual.setDate(fechaActual.getDate() - 7));
        
        const progresoPersonal = progreso.progreso
            .filter(p => p.usuario_id === id && new Date(p.fecha) > unaSemanaAtras)
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        // Calcular estadísticas personales
        const pesoInicial = progresoPersonal.find(p => p.tipo === 'peso')?.valor || 0;
        const pesoActual = progresoPersonal.filter(p => p.tipo === 'peso').pop()?.valor || pesoInicial;
        const cambio = pesoActual - pesoInicial;
        
        // Calcular asistencia
        const asistencias = progresoPersonal.filter(p => p.tipo === 'ejercicio').length;
        const asistenciaPorcentaje = (asistencias / 7) * 100;

        // Obtener ejercicios realizados
        const ejerciciosRealizados = progresoPersonal
            .filter(p => p.tipo === 'ejercicio')
            .reduce((acc, curr) => {
                const key = curr.ejercicio_id;
                if (!acc[key]) acc[key] = 0;
                acc[key]++;
                return acc;
            }, {});

        res.json({
            pesoInicial,
            pesoActual,
            cambio,
            asistenciaPorcentaje,
            ejerciciosRealizados,
            progresoDetallado: progresoPersonal
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener progreso personal' });
    }
});

// Obtener rutina actual del usuario
router.get('/:id/rutina-actual', async (req, res) => {
    try {
        const rutinasData = await fs.readFile(path.join(__dirname, '../data/rutinas.json'), 'utf8');
        const { rutinas } = JSON.parse(rutinasData);
        const ejerciciosData = await fs.readFile(path.join(__dirname, '../data/ejercicios.json'), 'utf8');
        const { ejercicios } = JSON.parse(ejerciciosData);

        // Por ahora devolvemos la primera rutina con los ejercicios detallados
        const rutina = rutinas[0];
        
        if (!rutina) {
            return res.status(404).json({ message: 'No se encontró rutina' });
        }

        // Agregar detalles de cada ejercicio
        const rutinaDetallada = {
            ...rutina,
            ejercicios: rutina.ejercicios.map(ej => ({
                ...ej,
                detalles: ejercicios.find(e => e.id === ej.ejercicio_id)
            }))
        };

        res.json(rutinaDetallada);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener rutina' });
    }
});

// Registrar nuevo progreso
router.post('/:id/registrar-progreso', async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, valor, ejercicio_id, series, repeticiones } = req.body;
        const data = await getProgreso();
        
        const nuevoProgreso = {
            id: String(data.progreso.length + 1),
            usuario_id: id,
            fecha: new Date().toISOString(),
            tipo,
            ...(tipo === 'peso' ? { valor } : { ejercicio_id, series, repeticiones })
        };
        
        data.progreso.push(nuevoProgreso);
        await fs.writeFile(PROGRESO_PATH, JSON.stringify(data, null, 2));
        
        res.status(201).json(nuevoProgreso);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar progreso' });
    }
});

// Obtener objetivos del usuario
router.get('/:id/objetivos', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getProgreso();
    
    const objetivosUsuario = data.progreso
      .filter(p => p.usuario_id === id && p.tipo === 'objetivo')
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    res.json(objetivosUsuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener objetivos' });
  }
});

// Registrar nuevo objetivo
router.post('/:id/objetivos', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, fecha_limite, tipo } = req.body;
    const data = await getProgreso();
    
    const nuevoObjetivo = {
      id: String(data.progreso.length + 1),
      usuario_id: id,
      fecha: new Date().toISOString(),
      tipo: 'objetivo',
      descripcion,
      fecha_limite,
      categoria: tipo,
      cumplido: false
    };
    
    data.progreso.push(nuevoObjetivo);
    await fs.writeFile(PROGRESO_PATH, JSON.stringify(data, null, 2));
    
    res.status(201).json(nuevoObjetivo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear objetivo' });
  }
});

// Marcar objetivo como cumplido
router.patch('/:id/objetivos/:objetivo_id', async (req, res) => {
  try {
    const { id, objetivo_id } = req.params;
    const data = await getProgreso();
    
    const objetivoIndex = data.progreso.findIndex(
      p => p.id === objetivo_id && p.usuario_id === id
    );
    
    if (objetivoIndex === -1) {
      return res.status(404).json({ message: 'Objetivo no encontrado' });
    }
    
    data.progreso[objetivoIndex].cumplido = true;
    data.progreso[objetivoIndex].fecha_cumplimiento = new Date().toISOString();
    
    await fs.writeFile(PROGRESO_PATH, JSON.stringify(data, null, 2));
    res.json(data.progreso[objetivoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar objetivo' });
  }
});

// Registrar medidas corporales
router.post('/:id/medidas', async (req, res) => {
  try {
    const { id } = req.params;
    const { pecho, cintura, cadera, brazos, piernas } = req.body;
    const data = await getProgreso();
    
    const nuevasMedidas = {
      id: String(data.progreso.length + 1),
      usuario_id: id,
      fecha: new Date().toISOString(),
      tipo: 'medidas',
      pecho: Number(pecho),
      cintura: Number(cintura),
      cadera: Number(cadera),
      brazos: Number(brazos),
      piernas: Number(piernas)
    };
    
    data.progreso.push(nuevasMedidas);
    await fs.writeFile(PROGRESO_PATH, JSON.stringify(data, null, 2));
    
    res.status(201).json(nuevasMedidas);
  } catch (error) {
    console.error('Error al registrar medidas:', error);
    res.status(500).json({ message: 'Error al registrar medidas' });
  }
});

// Obtener historial de medidas
router.get('/:id/medidas', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getProgreso();
    
    const medidasUsuario = data.progreso
      .filter(p => p.usuario_id === id && p.tipo === 'medidas')
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    res.json(medidasUsuario);
  } catch (error) {
    console.error('Error al obtener medidas:', error);
    res.status(500).json({ message: 'Error al obtener medidas' });
  }
});

// Obtener logros del usuario
router.get('/:id/logros', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getProgreso();
    
    // Calcular logros basados en el progreso
    const progresoUsuario = data.progreso.filter(p => p.usuario_id === id);
    const asistencias = progresoUsuario.filter(p => p.tipo === 'ejercicio').length;
    const objetivosCumplidos = progresoUsuario.filter(p => p.tipo === 'objetivo' && p.cumplido).length;
    
    const logros = [
      {
        id: 'asistencia_5',
        nombre: 'Constancia Inicial',
        descripcion: '5 días de asistencia',
        cumplido: asistencias >= 5,
        progreso: Math.min(asistencias / 5 * 100, 100)
      },
      {
        id: 'objetivos_3',
        nombre: 'Conquistador',
        descripcion: '3 objetivos cumplidos',
        cumplido: objetivosCumplidos >= 3,
        progreso: Math.min(objetivosCumplidos / 3 * 100, 100)
      }
    ];
    
    res.json(logros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logros' });
  }
});

// Asignar ejercicio a usuario
router.post('/:id/asignar-ejercicio', async (req, res) => {
  try {
    const { id } = req.params;
    const { ejercicio_id, series, repeticiones, notas } = req.body;
    const data = await getProgreso();
    
    const nuevoEjercicioAsignado = {
      id: String(data.progreso.length + 1),
      usuario_id: id,
      fecha: new Date().toISOString(),
      tipo: 'ejercicio_asignado',
      ejercicio_id,
      series,
      repeticiones,
      notas,
      completado: false
    };
    
    data.progreso.push(nuevoEjercicioAsignado);
    await fs.writeFile(PROGRESO_PATH, JSON.stringify(data, null, 2));
    
    res.status(201).json(nuevoEjercicioAsignado);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar ejercicio' });
  }
});

// Obtener ejercicios asignados de un usuario
router.get('/:id/ejercicios-asignados', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getProgreso();
    const ejerciciosData = await fs.readFile(path.join(__dirname, '../data/ejercicios.json'), 'utf8');
    const { ejercicios } = JSON.parse(ejerciciosData);
    
    const ejerciciosAsignados = data.progreso
      .filter(p => p.usuario_id === id && p.tipo === 'ejercicio_asignado')
      .map(ejercicio => ({
        ...ejercicio,
        detalles: ejercicios.find(e => e.id === ejercicio.ejercicio_id)
      }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    res.json(ejerciciosAsignados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ejercicios asignados' });
  }
});

// Marcar ejercicio asignado como completado
router.patch('/:id/ejercicios-asignados/:ejercicio_id', async (req, res) => {
  try {
    const { id, ejercicio_id } = req.params;
    const data = await getProgreso();
    
    const ejercicioIndex = data.progreso.findIndex(
      p => p.id === ejercicio_id && p.usuario_id === id && p.tipo === 'ejercicio_asignado'
    );
    
    if (ejercicioIndex === -1) {
      return res.status(404).json({ message: 'Ejercicio asignado no encontrado' });
    }
    
    data.progreso[ejercicioIndex].completado = true;
    data.progreso[ejercicioIndex].fecha_completado = new Date().toISOString();
    
    await fs.writeFile(PROGRESO_PATH, JSON.stringify(data, null, 2));
    res.json(data.progreso[ejercicioIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ejercicio asignado' });
  }
});

module.exports = router; 