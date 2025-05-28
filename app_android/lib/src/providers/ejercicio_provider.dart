import 'package:flutter/foundation.dart';
import 'package:sqflite/sqflite.dart';
import '../models/ejercicio_model.dart';
import '../services/database_helper.dart';

class EjercicioProvider with ChangeNotifier {
  List<Ejercicio> _ejercicios = [];
  final DatabaseHelper _db = DatabaseHelper.instance;
  List<Ejercicio> _ejerciciosAsignados = [];

  List<Ejercicio> get ejercicios => _ejercicios;
  List<Ejercicio> get ejerciciosAsignados => _ejerciciosAsignados;

  Future<void> loadEjercicios() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> ejerciciosData = await db.query('ejercicios');
    _ejercicios = ejerciciosData.map((data) => Ejercicio.fromJson(data)).toList();
    notifyListeners();
  }

  Future<void> addEjercicio(Ejercicio ejercicio) async {
    final db = await _db.database;
    await db.insert('ejercicios', ejercicio.toJson());
    await loadEjercicios();
  }

  Future<void> updateEjercicio(Ejercicio ejercicio) async {
    final db = await _db.database;
    await db.update(
      'ejercicios',
      ejercicio.toJson(),
      where: 'id = ?',
      whereArgs: [ejercicio.id],
    );
    await loadEjercicios();
  }

  Future<void> deleteEjercicio(String id) async {
    final db = await _db.database;
    await db.delete(
      'ejercicios',
      where: 'id = ?',
      whereArgs: [id],
    );
    await loadEjercicios();
  }

  Future<List<Ejercicio>> getEjercicios() async {
    if (_ejercicios.isEmpty) {
      await loadEjercicios();
    }
    return _ejercicios;
  }

  Future<List<Ejercicio>> getEjerciciosByCategoria(String categoria) async {
    await loadEjercicios();
    return _ejercicios.where((e) => e.categoria == categoria).toList();
  }

  Future<List<Ejercicio>> getEjerciciosByNivel(String nivel) async {
    await loadEjercicios();
    return _ejercicios.where((e) => e.nivel == nivel).toList();
  }

  Future<List<Ejercicio>> getEjerciciosAsignados(String userId) async {
    try {
      print('\n=== Obteniendo ejercicios asignados para usuario: $userId ===');
      final db = await _db.database;
      
      // 1. Verificar ejercicios disponibles
      final ejerciciosDisponibles = await db.rawQuery('SELECT * FROM ejercicios');
      print('Ejercicios disponibles en la base de datos: ${ejerciciosDisponibles.length}');
      
      if (ejerciciosDisponibles.isEmpty) {
        print('! No hay ejercicios disponibles en la base de datos');
        // Insertar ejercicios predeterminados
        final ejercicios = [
          {
            'id': '1',
            'nombre': 'Sentadillas',
            'categoria': 'Piernas',
            'descripcion': 'Ejercicio básico para fortalecer piernas y glúteos',
            'imagen': 'assets/images/ejercicios/sentadillas.jpg',
            'musculos': 'Cuádriceps,Glúteos,Isquiotibiales',
            'nivel': 'Principiante',
            'series': 3,
            'repeticiones': 12,
            'notas': 'Mantén la espalda recta y los pies separados al ancho de los hombros',
            'tipo': 'ejercicio'
          },
          {
            'id': '2',
            'nombre': 'Flexiones',
            'categoria': 'Pecho',
            'descripcion': 'Ejercicio para pecho, hombros y tríceps',
            'imagen': 'assets/images/ejercicios/flexiones.jpg',
            'musculos': 'Pectorales,Deltoides,Tríceps',
            'nivel': 'Principiante',
            'series': 3,
            'repeticiones': 10,
            'notas': 'Mantén el cuerpo recto y los codos cerca del cuerpo',
            'tipo': 'ejercicio'
          },
          {
            'id': '3',
            'nombre': 'Plancha',
            'categoria': 'Core',
            'descripcion': 'Ejercicio isométrico para fortalecer el core',
            'imagen': 'assets/images/ejercicios/plancha.jpg',
            'musculos': 'Abdominales,Oblicuos,Espalda baja',
            'nivel': 'Principiante',
            'series': 3,
            'repeticiones': 30,
            'notas': 'Mantén el cuerpo recto y contrae el abdomen',
            'tipo': 'ejercicio'
          }
        ];

        print('\n=== Insertando ejercicios predeterminados ===');
        for (var ejercicio in ejercicios) {
          try {
            await db.insert('ejercicios', ejercicio);
            print('✓ Ejercicio insertado: ${ejercicio['nombre']} (ID: ${ejercicio['id']})');
          } catch (e) {
            print('! Error insertando ejercicio ${ejercicio['nombre']}: $e');
          }
        }

        // Verificar nuevamente
        final ejerciciosNuevos = await db.rawQuery('SELECT * FROM ejercicios');
        print('Ejercicios después de insertar: ${ejerciciosNuevos.length}');
        if (ejerciciosNuevos.isEmpty) {
          return [];
        }
      }

      // 2. Verificar asignaciones existentes
      final List<Map<String, dynamic>> progreso = await db.query(
        'progreso',
        where: 'usuarioId = ? AND tipo = ?',
        whereArgs: [userId, 'ejercicio'],
      );
      print('Registros de progreso encontrados: ${progreso.length}');

      // 3. Si no hay asignaciones, crear nuevas
      if (progreso.isEmpty) {
        print('\n=== Creando nuevas asignaciones de ejercicios ===');
        final fecha = DateTime.now().toIso8601String();
        
        for (final ejercicio in ejerciciosDisponibles) {
          final progresoId = '${userId}_${ejercicio['id']}_$fecha';
          try {
            await db.insert('progreso', {
              'id': progresoId,
              'usuarioId': userId,
              'ejercicioId': ejercicio['id'],
              'fecha': fecha,
              'tipo': 'ejercicio',
              'series': ejercicio['series'],
              'repeticiones': ejercicio['repeticiones'],
              'descripcion': ejercicio['descripcion'],
              'categoria': ejercicio['categoria'],
              'completado': 0,
              'cumplido': 0,
              'notas': ejercicio['notas'],
            });
            print('✓ Ejercicio asignado: ${ejercicio['nombre']} (ID: ${ejercicio['id']})');
          } catch (e) {
            print('! Error asignando ejercicio ${ejercicio['nombre']}: $e');
          }
        }

        // Verificar asignaciones
        final asignacionesCreadas = await db.query(
          'progreso',
          where: 'usuarioId = ? AND tipo = ?',
          whereArgs: [userId, 'ejercicio'],
        );
        print('\n=== Resumen de asignaciones ===');
        print('Total de ejercicios asignados: ${asignacionesCreadas.length}');
        
        if (asignacionesCreadas.length == ejerciciosDisponibles.length) {
          print('✓ Todos los ejercicios fueron asignados correctamente');
        } else {
          print('! Advertencia: Se esperaban ${ejerciciosDisponibles.length} asignaciones pero se crearon ${asignacionesCreadas.length}');
        }

        final result = ejerciciosDisponibles.map((e) => Ejercicio.fromJson(e)).toList();
        print('Ejercicios convertidos a objetos: ${result.length}');
        return result;
      }

      // 4. Si hay asignaciones, obtener detalles de ejercicios
      print('\n=== Obteniendo detalles de ejercicios asignados ===');
      final ejercicios = <Ejercicio>[];
      for (final p in progreso) {
        final ejercicioId = p['ejercicioId'];
        if (ejercicioId != null) {
          final ejercicioData = await db.query(
            'ejercicios',
            where: 'id = ?',
            whereArgs: [ejercicioId],
          );
          if (ejercicioData.isNotEmpty) {
            ejercicios.add(Ejercicio.fromJson(ejercicioData.first));
            print('✓ Ejercicio recuperado: ${ejercicioData.first['nombre']} (ID: $ejercicioId)');
          } else {
            print('! No se encontró el ejercicio con ID: $ejercicioId');
          }
        }
      }

      print('\n=== Resumen final ===');
      print('Total de ejercicios recuperados: ${ejercicios.length}');
      print('=====================================\n');
      
      return ejercicios;
    } catch (e) {
      print('! Error crítico obteniendo ejercicios asignados: $e');
      return [];
    }
  }

  Future<List<Ejercicio>> getAllEjercicios() async {
    try {
      final db = await _db.database;
      final List<Map<String, dynamic>> ejercicios = await db.query('ejercicios');
      return ejercicios.map((e) => Ejercicio.fromJson(e)).toList();
    } catch (e) {
      print('Error obteniendo ejercicios: $e');
      return [];
    }
  }
} 