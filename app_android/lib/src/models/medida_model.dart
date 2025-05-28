import 'package:json_annotation/json_annotation.dart';

part 'medida_model.g.dart';

@JsonSerializable()
class Medida {
  final String id;
  final String usuarioId;
  final DateTime fecha;
  final double peso;
  final double? altura;
  final double? pecho;
  final double? cintura;
  final double? cadera;
  final double? brazoIzquierdo;
  final double? brazoDerecho;
  final double? piernaIzquierda;
  final double? piernaDerecha;
  final String? notas;

  Medida({
    required this.id,
    required this.usuarioId,
    required this.fecha,
    required this.peso,
    this.altura,
    this.pecho,
    this.cintura,
    this.cadera,
    this.brazoIzquierdo,
    this.brazoDerecho,
    this.piernaIzquierda,
    this.piernaDerecha,
    this.notas,
  });

  factory Medida.fromJson(Map<String, dynamic> json) => _$MedidaFromJson(json);
  Map<String, dynamic> toJson() => _$MedidaToJson(this);

  double? get imc {
    if (altura != null && altura! > 0) {
      return peso / ((altura! / 100) * (altura! / 100));
    }
    return null;
  }

  Medida copyWith({
    String? id,
    String? usuarioId,
    DateTime? fecha,
    double? peso,
    double? altura,
    double? pecho,
    double? cintura,
    double? cadera,
    double? brazoIzquierdo,
    double? brazoDerecho,
    double? piernaIzquierda,
    double? piernaDerecha,
    String? notas,
  }) {
    return Medida(
      id: id ?? this.id,
      usuarioId: usuarioId ?? this.usuarioId,
      fecha: fecha ?? this.fecha,
      peso: peso ?? this.peso,
      altura: altura ?? this.altura,
      pecho: pecho ?? this.pecho,
      cintura: cintura ?? this.cintura,
      cadera: cadera ?? this.cadera,
      brazoIzquierdo: brazoIzquierdo ?? this.brazoIzquierdo,
      brazoDerecho: brazoDerecho ?? this.brazoDerecho,
      piernaIzquierda: piernaIzquierda ?? this.piernaIzquierda,
      piernaDerecha: piernaDerecha ?? this.piernaDerecha,
      notas: notas ?? this.notas,
    );
  }
} 