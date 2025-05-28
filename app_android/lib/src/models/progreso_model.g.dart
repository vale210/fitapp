// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progreso_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Progreso _$ProgresoFromJson(Map<String, dynamic> json) => Progreso(
      id: json['id'] as String,
      usuarioId: json['usuarioId'] as String,
      fecha: DateTime.parse(json['fecha'] as String),
      tipo: json['tipo'] as String,
      valor: (json['valor'] as num?)?.toDouble(),
      unidad: json['unidad'] as String?,
      ejercicioId: json['ejercicioId'] as String?,
      series: (json['series'] as num?)?.toInt(),
      repeticiones: (json['repeticiones'] as num?)?.toInt(),
      notas: json['notas'] as String?,
      completado: json['completado'] as bool?,
      fechaCompletado: json['fechaCompletado'] == null
          ? null
          : DateTime.parse(json['fechaCompletado'] as String),
      descripcion: json['descripcion'] as String?,
      fechaLimite: json['fechaLimite'] == null
          ? null
          : DateTime.parse(json['fechaLimite'] as String),
      categoria: json['categoria'] as String?,
      cumplido: json['cumplido'] as bool?,
    );

Map<String, dynamic> _$ProgresoToJson(Progreso instance) => <String, dynamic>{
      'id': instance.id,
      'usuarioId': instance.usuarioId,
      'fecha': instance.fecha.toIso8601String(),
      'tipo': instance.tipo,
      'valor': instance.valor,
      'unidad': instance.unidad,
      'ejercicioId': instance.ejercicioId,
      'series': instance.series,
      'repeticiones': instance.repeticiones,
      'notas': instance.notas,
      'completado': instance.completado,
      'fechaCompletado': instance.fechaCompletado?.toIso8601String(),
      'descripcion': instance.descripcion,
      'fechaLimite': instance.fechaLimite?.toIso8601String(),
      'categoria': instance.categoria,
      'cumplido': instance.cumplido,
    };
