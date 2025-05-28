import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/user_model.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('tenafit.db');
    
    // Verificar si hay ejercicios
    final ejerciciosCount = Sqflite.firstIntValue(
      await _database!.rawQuery('SELECT COUNT(*) FROM ejercicios')
    );
    
    if (ejerciciosCount == 0) {
      print('No hay ejercicios, insertando ejercicios predeterminados...');
      await _insertarEjerciciosPredeterminados(_database!);
    }
    
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    try {
      print('Iniciando creación de base de datos...');
      
      await db.execute('''
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          rol TEXT NOT NULL,
          estado TEXT NOT NULL,
          fechaRegistro TEXT NOT NULL,
          ultimoAcceso TEXT
        )
      ''');
      print('Tabla users creada');

      await db.execute('''
        CREATE TABLE ejercicios (
          id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL,
          categoria TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          imagen TEXT,
          musculos TEXT NOT NULL,
          nivel TEXT NOT NULL,
          series INTEGER,
          repeticiones INTEGER,
          notas TEXT
        )
      ''');
      print('Tabla ejercicios creada');

      await db.execute('''
        CREATE TABLE progreso (
          id TEXT PRIMARY KEY,
          usuarioId TEXT NOT NULL,
          fecha TEXT NOT NULL,
          tipo TEXT NOT NULL,
          valor REAL,
          unidad TEXT,
          ejercicioId TEXT,
          series INTEGER,
          repeticiones INTEGER,
          notas TEXT,
          completado INTEGER,
          fechaCompletado TEXT,
          descripcion TEXT,
          fechaLimite TEXT,
          categoria TEXT,
          cumplido INTEGER,
          FOREIGN KEY (usuarioId) REFERENCES users (id)
        )
      ''');
      print('Tabla progreso creada');

      await db.execute('''
        CREATE TABLE medidas (
          id TEXT PRIMARY KEY,
          usuarioId TEXT NOT NULL,
          fecha TEXT NOT NULL,
          peso REAL NOT NULL,
          altura REAL,
          pecho REAL,
          cintura REAL,
          cadera REAL,
          brazoIzquierdo REAL,
          brazoDerecho REAL,
          piernaIzquierda REAL,
          piernaDerecha REAL,
          notas TEXT,
          FOREIGN KEY (usuarioId) REFERENCES users (id)
        )
      ''');
      print('Tabla medidas creada');

      // Insertar usuario admin por defecto
      await db.insert('users', {
        'id': '1',
        'nombre': 'Admin',
        'email': 'admin@tenafit.com',
        'password': 'admin123',
        'rol': 'admin',
        'estado': 'activo',
        'fechaRegistro': DateTime.now().toIso8601String(),
        'ultimoAcceso': DateTime.now().toIso8601String(),
      });
      print('Usuario admin creado');

      // Insertar ejercicios predeterminados
      final ejerciciosDefault = [
        {
          'id': '1',
          'nombre': 'Flexiones de Pecho',
          'categoria': 'Pecho',
          'descripcion': 'Ejercicio básico para desarrollar el pecho y los tríceps. Mantén el cuerpo recto y baja hasta que tu pecho casi toque el suelo.',
          'imagen': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=800',
          'musculos': 'pecho,triceps,hombros',
          'nivel': 'principiante',
          'series': 3,
          'repeticiones': 10,
          'notas': 'Mantén la espalda recta durante todo el movimiento',
        },
        {
          'id': '2',
          'nombre': 'Sentadillas',
          'categoria': 'Piernas',
          'descripcion': 'Ejercicio fundamental para fortalecer piernas y glúteos. Mantén los pies separados al ancho de los hombros y baja como si fueras a sentarte.',
          'imagen': 'https://images.unsplash.com/photo-1604247584233-99c80a8aae2c?w=800',
          'musculos': 'cuadriceps,gluteos,isquiotibiales',
          'nivel': 'principiante',
          'series': 3,
          'repeticiones': 12,
          'notas': 'Las rodillas no deben sobrepasar la punta de los pies',
        },
        {
          'id': '3',
          'nombre': 'Plancha Abdominal',
          'categoria': 'Core',
          'descripcion': 'Ejercicio isométrico para fortalecer el core. Mantén el cuerpo recto apoyado en antebrazos y pies.',
          'imagen': 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800',
          'musculos': 'abdominales,core',
          'nivel': 'principiante',
          'series': 3,
          'repeticiones': 30,
          'notas': 'Mantén durante 30 segundos cada serie',
        },
        {
          'id': '4',
          'nombre': 'Dominadas',
          'categoria': 'Espalda',
          'descripcion': 'Ejercicio para desarrollar la espalda y los bíceps. Agarra la barra con las palmas hacia adelante y súbete hasta que tu barbilla supere la barra.',
          'imagen': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=800',
          'musculos': 'espalda,biceps',
          'nivel': 'intermedio',
          'series': 3,
          'repeticiones': 8,
          'notas': 'Si es muy difícil, usa una banda elástica para asistencia',
        },
        {
          'id': '5',
          'nombre': 'Burpees',
          'categoria': 'Cardio',
          'descripcion': 'Ejercicio de cuerpo completo que combina flexión, sentadilla y salto. Excelente para quemar calorías.',
          'imagen': 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800',
          'musculos': 'fullbody,cardio',
          'nivel': 'intermedio',
          'series': 3,
          'repeticiones': 10,
          'notas': 'Toma un breve descanso entre series',
        },
      ];

      print('Insertando ${ejerciciosDefault.length} ejercicios predeterminados...');
      for (final ejercicio in ejerciciosDefault) {
        try {
          await db.insert('ejercicios', ejercicio);
          print('Ejercicio insertado: ${ejercicio['nombre']}');
        } catch (e) {
          print('Error insertando ejercicio ${ejercicio['nombre']}: $e');
        }
      }

      // Verificar que los ejercicios se insertaron
      final ejerciciosCount = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM ejercicios'));
      print('Total de ejercicios en la base de datos: $ejerciciosCount');

    } catch (e) {
      print('Error en _createDB: $e');
      rethrow;
    }
  }

  Future<User?> getUser(String email, String password) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'users',
      where: 'email = ? AND password = ?',
      whereArgs: [email, password],
    );

    if (maps.isEmpty) return null;
    return User.fromJson(maps.first);
  }

  Future<bool> insertUser(User user) async {
    try {
      final db = await database;
      
      // Verificar si el email ya existe
      final List<Map<String, dynamic>> existingUser = await db.query(
        'users',
        where: 'email = ?',
        whereArgs: [user.email],
      );

      if (existingUser.isNotEmpty) {
        print('Error: El email ya está registrado');
        return false;
      }

      await db.insert('users', {
        'id': user.id,
        'nombre': user.nombre,
        'email': user.email,
        'password': user.password,
        'rol': user.rol,
        'estado': user.estado ?? 'activo',
        'fechaRegistro': user.fechaRegistro?.toIso8601String() ?? DateTime.now().toIso8601String(),
        'ultimoAcceso': user.ultimoAcceso?.toIso8601String(),
      });
      return true;
    } catch (e) {
      print('Error insertando usuario: $e');
      return false;
    }
  }

  Future<void> _insertarEjerciciosPredeterminados(Database db) async {
    final ejerciciosDefault = [
      {
        'id': '1',
        'nombre': 'Flexiones de Pecho',
        'categoria': 'Pecho',
        'descripcion': 'Ejercicio básico para desarrollar el pecho y los tríceps. Mantén el cuerpo recto y baja hasta que tu pecho casi toque el suelo.',
        'imagen': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=800',
        'musculos': 'pecho,triceps,hombros',
        'nivel': 'principiante',
        'series': 3,
        'repeticiones': 10,
        'notas': 'Mantén la espalda recta durante todo el movimiento',
      },
      {
        'id': '2',
        'nombre': 'Sentadillas',
        'categoria': 'Piernas',
        'descripcion': 'Ejercicio fundamental para fortalecer piernas y glúteos. Mantén los pies separados al ancho de los hombros y baja como si fueras a sentarte.',
        'imagen': 'https://images.unsplash.com/photo-1604247584233-99c80a8aae2c?w=800',
        'musculos': 'cuadriceps,gluteos,isquiotibiales',
        'nivel': 'principiante',
        'series': 3,
        'repeticiones': 12,
        'notas': 'Las rodillas no deben sobrepasar la punta de los pies',
      },
      {
        'id': '3',
        'nombre': 'Plancha Abdominal',
        'categoria': 'Core',
        'descripcion': 'Ejercicio isométrico para fortalecer el core. Mantén el cuerpo recto apoyado en antebrazos y pies.',
        'imagen': 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800',
        'musculos': 'abdominales,core',
        'nivel': 'principiante',
        'series': 3,
        'repeticiones': 30,
        'notas': 'Mantén durante 30 segundos cada serie',
      },
      {
        'id': '4',
        'nombre': 'Dominadas',
        'categoria': 'Espalda',
        'descripcion': 'Ejercicio para desarrollar la espalda y los bíceps. Agarra la barra con las palmas hacia adelante y súbete hasta que tu barbilla supere la barra.',
        'imagen': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=800',
        'musculos': 'espalda,biceps',
        'nivel': 'intermedio',
        'series': 3,
        'repeticiones': 8,
        'notas': 'Si es muy difícil, usa una banda elástica para asistencia',
      },
      {
        'id': '5',
        'nombre': 'Burpees',
        'categoria': 'Cardio',
        'descripcion': 'Ejercicio de cuerpo completo que combina flexión, sentadilla y salto. Excelente para quemar calorías.',
        'imagen': 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800',
        'musculos': 'fullbody,cardio',
        'nivel': 'intermedio',
        'series': 3,
        'repeticiones': 10,
        'notas': 'Toma un breve descanso entre series',
      },
    ];

    for (final ejercicio in ejerciciosDefault) {
      try {
        await db.insert('ejercicios', ejercicio);
        print('Ejercicio insertado: ${ejercicio['nombre']}');
      } catch (e) {
        print('Error insertando ejercicio ${ejercicio['nombre']}: $e');
      }
    }

    final count = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM ejercicios'));
    print('Total de ejercicios en la base de datos después de insertar: $count');
  }

  Future<void> resetDatabase() async {
    try {
      final dbPath = await getDatabasesPath();
      final path = join(dbPath, 'tenafit.db');
      
      // Cerrar la base de datos si está abierta
      if (_database != null) {
        await _database!.close();
        _database = null;
      }
      
      // Eliminar el archivo de la base de datos
      await deleteDatabase(path);
      print('Base de datos eliminada');
      
      // Reinicializar la base de datos
      _database = await _initDB('tenafit.db');
      print('Base de datos reinicializada');
    } catch (e) {
      print('Error reseteando la base de datos: $e');
    }
  }
} 