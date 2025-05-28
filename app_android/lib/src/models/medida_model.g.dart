// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'medida_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Medida _$MedidaFromJson(Map<String, dynamic> json) => Medida(
      id: json['id'] as String,
      usuarioId: json['usuarioId'] as String,
      fecha: DateTime.parse(json['fecha'] as String),
      peso: (json['peso'] as num).toDouble(),
      altura: (json['altura'] as num?)?.toDouble(),
      pecho: (json['pecho'] as num?)?.toDouble(),
      cintura: (json['cintura'] as num?)?.toDouble(),
      cadera: (json['cadera'] as num?)?.toDouble(),
      brazoIzquierdo: (json['brazoIzquierdo'] as num?)?.toDouble(),
      brazoDerecho: (json['brazoDerecho'] as num?)?.toDouble(),
      piernaIzquierda: (json['piernaIzquierda'] as num?)?.toDouble(),
      piernaDerecha: (json['piernaDerecha'] as num?)?.toDouble(),
      notas: json['notas'] as String?,
    );

Map<String, dynamic> _$MedidaToJson(Medida instance) => <String, dynamic>{
      'id': instance.id,
      'usuarioId': instance.usuarioId,
      'fecha': instance.fecha.toIso8601String(),
      'peso': instance.peso,
      'altura': instance.altura,
      'pecho': instance.pecho,
      'cintura': instance.cintura,
      'cadera': instance.cadera,
      'brazoIzquierdo': instance.brazoIzquierdo,
      'brazoDerecho': instance.brazoDerecho,
      'piernaIzquierda': instance.piernaIzquierda,
      'piernaDerecha': instance.piernaDerecha,
      'notas': instance.notas,
    };
