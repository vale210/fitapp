import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String nombre;
  final String email;
  final String password;
  final String rol;
  final String? estado;
  final DateTime? fechaRegistro;
  final DateTime? ultimoAcceso;

  User({
    required this.id,
    required this.nombre,
    required this.email,
    required this.password,
    required this.rol,
    this.estado,
    this.fechaRegistro,
    this.ultimoAcceso,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      nombre: json['nombre'] as String,
      email: json['email'] as String,
      password: json['password'] as String,
      rol: json['rol'] as String,
      estado: json['estado'] as String?,
      fechaRegistro: json['fechaRegistro'] != null ? DateTime.parse(json['fechaRegistro'] as String) : null,
      ultimoAcceso: json['ultimoAcceso'] != null ? DateTime.parse(json['ultimoAcceso'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() => _$UserToJson(this);

  User copyWith({
    String? id,
    String? nombre,
    String? email,
    String? password,
    String? rol,
    String? estado,
    DateTime? fechaRegistro,
    DateTime? ultimoAcceso,
  }) {
    return User(
      id: id ?? this.id,
      nombre: nombre ?? this.nombre,
      email: email ?? this.email,
      password: password ?? this.password,
      rol: rol ?? this.rol,
      estado: estado ?? this.estado,
      fechaRegistro: fechaRegistro ?? this.fechaRegistro,
      ultimoAcceso: ultimoAcceso ?? this.ultimoAcceso,
    );
  }
} 