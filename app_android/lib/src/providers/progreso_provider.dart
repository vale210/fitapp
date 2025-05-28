import 'package:flutter/foundation.dart';
import '../services/database_helper.dart';
import '../models/progreso_model.dart';

class ProgresoProvider with ChangeNotifier {
  final DatabaseHelper _db = DatabaseHelper.instance;
  Progreso? _progresoActual;

  Progreso? get progresoActual => _progresoActual;

  Future<Progreso> getProgresoPersonal(String userId) async {
    try {
      final db = await _db.database;
      
      // Obtener todos los registros de peso ordenados por fecha
      final pesoRecords = await db.query(
        'progreso',
        where: 'usuarioId = ? AND tipo = ?',
        whereArgs: [userId, 'peso'],
        orderBy: 'fecha ASC',
      );

      // Obtener el último registro de asistencia
      final asistenciaRecords = await db.query(
        'progreso',
        where: 'usuarioId = ? AND tipo = ?',
        whereArgs: [userId, 'asistencia'],
        orderBy: 'fecha DESC',
      );

      // Calcular estadísticas
      double pesoInicial = 0;
      double pesoActual = 0;
      double cambio = 0;
      double asistenciaPorcentaje = 0;

      if (pesoRecords.isNotEmpty) {
        // El primer registro es el peso inicial
        pesoInicial = (pesoRecords.first['valor'] as num).toDouble();
        // El último registro es el peso actual
        pesoActual = (pesoRecords.last['valor'] as num).toDouble();
        cambio = pesoActual - pesoInicial;
      }

      // Calcular porcentaje de asistencia del último mes
      if (asistenciaRecords.isNotEmpty) {
        final ultimoMes = DateTime.now().subtract(const Duration(days: 30));
        final asistenciasUltimoMes = asistenciaRecords.where((record) {
          final fecha = DateTime.parse(record['fecha'] as String);
          return fecha.isAfter(ultimoMes);
        }).length;
        asistenciaPorcentaje = (asistenciasUltimoMes / 30) * 100;
      }

      // Si no hay registros, devolver un progreso inicial
      if (pesoRecords.isEmpty && asistenciaRecords.isEmpty) {
        _progresoActual = Progreso(
          id: '0',
          usuarioId: userId,
          fecha: DateTime.now(),
          tipo: 'inicial',
          valor: 0,
          pesoInicial: 0,
          pesoActual: 0,
          cambio: 0,
          asistenciaPorcentaje: 0,
        );
        notifyListeners();
        return _progresoActual!;
      }

      // Crear el objeto Progreso con los datos
      _progresoActual = Progreso(
        id: pesoRecords.isNotEmpty ? pesoRecords.last['id'] as String : '0',
        usuarioId: userId,
        fecha: pesoRecords.isNotEmpty 
          ? DateTime.parse(pesoRecords.last['fecha'] as String)
          : DateTime.now(),
        tipo: 'resumen',
        valor: pesoActual,
        unidad: 'kg',
        pesoInicial: pesoInicial,
        pesoActual: pesoActual,
        cambio: cambio,
        asistenciaPorcentaje: asistenciaPorcentaje,
      );
      notifyListeners();
      return _progresoActual!;
    } catch (e) {
      print('Error en getProgresoPersonal: $e');
      rethrow;
    }
  }

  Future<bool> registrarPeso(String userId, double peso) async {
    try {
      final db = await _db.database;
      final id = DateTime.now().millisecondsSinceEpoch.toString();
      
      await db.insert('progreso', {
        'id': id,
        'usuarioId': userId,
        'fecha': DateTime.now().toIso8601String(),
        'tipo': 'peso',
        'valor': peso,
        'unidad': 'kg',
      });

      // Actualizar el progreso actual
      await getProgresoPersonal(userId);
      return true;
    } catch (e) {
      print('Error registrando peso: $e');
      return false;
    }
  }

  Future<bool> registrarEjercicio(String userId, String ejercicioId, int series, int repeticiones) async {
    try {
      final db = await _db.database;
      final nuevoRegistro = Progreso(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        usuarioId: userId,
        fecha: DateTime.now(),
        tipo: 'ejercicio',
        ejercicioId: ejercicioId,
        series: series,
        repeticiones: repeticiones,
      );

      await db.insert('progreso', nuevoRegistro.toJson());
      await getProgresoPersonal(userId); // Actualizar el progreso actual
      return true;
    } catch (e) {
      print('Error registrando ejercicio: $e');
      return false;
    }
  }
} 