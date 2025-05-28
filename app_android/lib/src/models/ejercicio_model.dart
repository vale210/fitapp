import 'package:json_annotation/json_annotation.dart';

part 'ejercicio_model.g.dart';

@JsonSerializable()
class Ejercicio {
  final String id;
  final String nombre;
  final String categoria;
  final String descripcion;
  final String imagen;
  final List<String> musculos;
  final String nivel;
  final int? series;
  final int? repeticiones;
  final String? notas;

  Ejercicio({
    required this.id,
    required this.nombre,
    required this.categoria,
    required this.descripcion,
    required this.imagen,
    required this.musculos,
    required this.nivel,
    this.series,
    this.repeticiones,
    this.notas,
  });

  factory Ejercicio.fromJson(Map<String, dynamic> json) {
    return Ejercicio(
      id: json['id'] as String,
      nombre: json['nombre'] as String,
      categoria: json['categoria'] as String,
      descripcion: json['descripcion'] as String,
      imagen: json['imagen'] as String,
      musculos: (json['musculos'] as String).split(','),
      nivel: json['nivel'] as String,
      series: json['series'] as int?,
      repeticiones: json['repeticiones'] as int?,
      notas: json['notas'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nombre': nombre,
      'categoria': categoria,
      'descripcion': descripcion,
      'imagen': imagen,
      'musculos': musculos.join(','),
      'nivel': nivel,
      'series': series,
      'repeticiones': repeticiones,
      'notas': notas,
    };
  }

  Ejercicio copyWith({
    String? id,
    String? nombre,
    String? categoria,
    String? descripcion,
    String? imagen,
    List<String>? musculos,
    String? nivel,
    int? series,
    int? repeticiones,
    String? notas,
  }) {
    return Ejercicio(
      id: id ?? this.id,
      nombre: nombre ?? this.nombre,
      categoria: categoria ?? this.categoria,
      descripcion: descripcion ?? this.descripcion,
      imagen: imagen ?? this.imagen,
      musculos: musculos ?? this.musculos,
      nivel: nivel ?? this.nivel,
      series: series ?? this.series,
      repeticiones: repeticiones ?? this.repeticiones,
      notas: notas ?? this.notas,
    );
  }
} 