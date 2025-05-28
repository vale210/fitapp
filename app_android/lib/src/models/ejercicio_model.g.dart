// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ejercicio_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Ejercicio _$EjercicioFromJson(Map<String, dynamic> json) => Ejercicio(
      id: json['id'] as String,
      nombre: json['nombre'] as String,
      categoria: json['categoria'] as String,
      descripcion: json['descripcion'] as String,
      imagen: json['imagen'] as String,
      musculos:
          (json['musculos'] as List<dynamic>).map((e) => e as String).toList(),
      nivel: json['nivel'] as String,
      series: (json['series'] as num?)?.toInt(),
      repeticiones: (json['repeticiones'] as num?)?.toInt(),
      notas: json['notas'] as String?,
    );

Map<String, dynamic> _$EjercicioToJson(Ejercicio instance) => <String, dynamic>{
      'id': instance.id,
      'nombre': instance.nombre,
      'categoria': instance.categoria,
      'descripcion': instance.descripcion,
      'imagen': instance.imagen,
      'musculos': instance.musculos,
      'nivel': instance.nivel,
      'series': instance.series,
      'repeticiones': instance.repeticiones,
      'notas': instance.notas,
    };
