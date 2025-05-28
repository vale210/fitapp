import 'package:json_annotation/json_annotation.dart';

part 'progreso_model.g.dart';

@JsonSerializable()
class Progreso {
  final String id;
  final String usuarioId;
  final DateTime fecha;
  final String tipo;
  final double? valor;
  final String? unidad;
  final String? ejercicioId;
  final int? series;
  final int? repeticiones;
  final String? notas;
  final bool? completado;
  final DateTime? fechaCompletado;
  final String? descripcion;
  final DateTime? fechaLimite;
  final String? categoria;
  final bool? cumplido;
  final double? _pesoInicial;
  final double? _pesoActual;
  final double? _cambio;
  final double? _asistenciaPorcentaje;

  Progreso({
    required this.id,
    required this.usuarioId,
    required this.fecha,
    required this.tipo,
    this.valor,
    this.unidad,
    this.ejercicioId,
    this.series,
    this.repeticiones,
    this.notas,
    this.completado,
    this.fechaCompletado,
    this.descripcion,
    this.fechaLimite,
    this.categoria,
    this.cumplido,
    double? pesoInicial,
    double? pesoActual,
    double? cambio,
    double? asistenciaPorcentaje,
  })  : _pesoInicial = pesoInicial,
        _pesoActual = pesoActual,
        _cambio = cambio,
        _asistenciaPorcentaje = asistenciaPorcentaje;

  factory Progreso.fromJson(Map<String, dynamic> json) {
    return Progreso(
      id: json['id'] as String,
      usuarioId: json['usuarioId'] as String,
      fecha: DateTime.parse(json['fecha'] as String),
      tipo: json['tipo'] as String,
      valor: (json['valor'] as num?)?.toDouble(),
      unidad: json['unidad'] as String?,
      ejercicioId: json['ejercicioId'] as String?,
      series: json['series'] as int?,
      repeticiones: json['repeticiones'] as int?,
      notas: json['notas'] as String?,
      completado: json['completado'] as bool?,
      fechaCompletado: json['fechaCompletado'] != null ? DateTime.parse(json['fechaCompletado'] as String) : null,
      descripcion: json['descripcion'] as String?,
      fechaLimite: json['fechaLimite'] != null ? DateTime.parse(json['fechaLimite'] as String) : null,
      categoria: json['categoria'] as String?,
      cumplido: json['cumplido'] as bool?,
      pesoInicial: (json['pesoInicial'] as num?)?.toDouble(),
      pesoActual: (json['pesoActual'] as num?)?.toDouble(),
      cambio: (json['cambio'] as num?)?.toDouble(),
      asistenciaPorcentaje: (json['asistenciaPorcentaje'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'usuarioId': usuarioId,
      'fecha': fecha.toIso8601String(),
      'tipo': tipo,
      'valor': valor,
      'unidad': unidad,
      'ejercicioId': ejercicioId,
      'series': series,
      'repeticiones': repeticiones,
      'notas': notas,
      'completado': completado,
      'fechaCompletado': fechaCompletado?.toIso8601String(),
      'descripcion': descripcion,
      'fechaLimite': fechaLimite?.toIso8601String(),
      'categoria': categoria,
      'cumplido': cumplido,
      'pesoInicial': _pesoInicial,
      'pesoActual': _pesoActual,
      'cambio': _cambio,
      'asistenciaPorcentaje': _asistenciaPorcentaje,
    };
  }

  double get pesoInicial => _pesoInicial ?? 0.0;
  double get pesoActual => _pesoActual ?? valor ?? 0.0;
  double get cambio => _cambio ?? 0.0;
  double get asistenciaPorcentaje => _asistenciaPorcentaje ?? 0.0;
}

class RegistroProgreso {
  final String id;
  final DateTime fecha;
  final String tipo;
  final double? valor;
  final String? ejercicioId;
  final int? series;
  final int? repeticiones;

  RegistroProgreso({
    required this.id,
    required this.fecha,
    required this.tipo,
    this.valor,
    this.ejercicioId,
    this.series,
    this.repeticiones,
  });

  factory RegistroProgreso.fromJson(Map<String, dynamic> json) {
    return RegistroProgreso(
      id: json['id'],
      fecha: DateTime.parse(json['fecha']),
      tipo: json['tipo'],
      valor: json['valor']?.toDouble(),
      ejercicioId: json['ejercicio_id'],
      series: json['series'],
      repeticiones: json['repeticiones'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fecha': fecha.toIso8601String(),
      'tipo': tipo,
      'valor': valor,
      'ejercicio_id': ejercicioId,
      'series': series,
      'repeticiones': repeticiones,
    };
  }
} 