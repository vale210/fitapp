// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
      id: json['id'] as String,
      nombre: json['nombre'] as String,
      email: json['email'] as String,
      password: json['password'] as String,
      rol: json['rol'] as String,
      estado: json['estado'] as String?,
      fechaRegistro: json['fechaRegistro'] == null
          ? null
          : DateTime.parse(json['fechaRegistro'] as String),
      ultimoAcceso: json['ultimoAcceso'] == null
          ? null
          : DateTime.parse(json['ultimoAcceso'] as String),
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'id': instance.id,
      'nombre': instance.nombre,
      'email': instance.email,
      'password': instance.password,
      'rol': instance.rol,
      'estado': instance.estado,
      'fechaRegistro': instance.fechaRegistro?.toIso8601String(),
      'ultimoAcceso': instance.ultimoAcceso?.toIso8601String(),
    };
