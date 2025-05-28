import 'package:flutter/foundation.dart';
import 'package:sqflite/sqflite.dart';
import '../models/user_model.dart';
import '../services/database_helper.dart';

class AuthProvider with ChangeNotifier {
  User? _currentUser;
  final DatabaseHelper _db = DatabaseHelper.instance;

  User? get currentUser => _currentUser;

  Future<bool> login(String email, String password) async {
    try {
      final user = await _db.getUser(email, password);
      if (user != null) {
        _currentUser = user;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Error en login: $e');
      return false;
    }
  }

  Future<bool> register(String nombre, String email, String password) async {
    try {
      print('\n=== Iniciando registro de usuario ===');
      
      final newUser = User(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        nombre: nombre,
        email: email,
        password: password,
        rol: 'cliente',
        estado: 'activo',
        fechaRegistro: DateTime.now(),
      );

      print('Intentando registrar usuario: ${newUser.email}');
      final success = await _db.insertUser(newUser);
      
      if (success) {
        print('✓ Usuario registrado correctamente');
        _currentUser = newUser;
        notifyListeners();
        return true;
      } else {
        print('! Error: No se pudo registrar el usuario');
        return false;
      }
    } catch (e) {
      print('! Error en registro: $e');
      rethrow;
    }
  }

  Future<List<User>> getUsers() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> users = await db.query('users');
    return users.map((user) => User.fromJson(user)).toList();
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }
} 