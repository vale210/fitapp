import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/user_model.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._internal();
  static Database? _database;
  static const String _dbName = 'tenafit.db';

  DatabaseHelper._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    
    print('\n=== Inicializando base de datos ===');
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, _dbName);
    print('Ruta de la base de datos: $path');
    
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onOpen: (db) async {
        print('Base de datos abierta');
        final tables = await db.query('sqlite_master', where: 'type = ?', whereArgs: ['table']);
        print('Tablas disponibles:');
        for (var table in tables) {
          if (table['name'] != 'android_metadata' && table['name'] != 'sqlite_sequence') {
            print('- ${table['name']}');
          }
        }
      },
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    print('\n=== Creando tablas de la base de datos ===');
    
    try {
      // Crear tabla usuarios
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
      print('✓ Tabla users creada');

      // Crear tabla ejercicios
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
          notas TEXT,
          tipo TEXT DEFAULT 'ejercicio'
        )
      ''');
      print('✓ Tabla ejercicios creada');

      // Crear tabla progreso
      await db.execute('''
        CREATE TABLE progreso (
          id TEXT PRIMARY KEY,
          usuarioId TEXT NOT NULL,
          ejercicioId TEXT,
          fecha TEXT NOT NULL,
          tipo TEXT NOT NULL,
          valor REAL,
          unidad TEXT,
          series INTEGER,
          repeticiones INTEGER,
          notas TEXT,
          completado INTEGER,
          fechaCompletado TEXT,
          descripcion TEXT,
          fechaLimite TEXT,
          categoria TEXT,
          cumplido INTEGER,
          pesoInicial REAL,
          pesoActual REAL,
          cambio REAL,
          asistenciaPorcentaje REAL,
          FOREIGN KEY (usuarioId) REFERENCES users (id),
          FOREIGN KEY (ejercicioId) REFERENCES ejercicios (id)
        )
      ''');
      print('✓ Tabla progreso creada');

      // Crear tabla medidas
      await db.execute('''
        CREATE TABLE medidas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          fecha TEXT NOT NULL,
          peso REAL,
          altura REAL,
          cintura REAL,
          cadera REAL,
          pecho REAL,
          brazo_izquierdo REAL,
          brazo_derecho REAL,
          pierna_izquierda REAL,
          pierna_derecha REAL,
          FOREIGN KEY (usuario_id) REFERENCES users (id)
        )
      ''');

      print('Tablas creadas correctamente');
      await insertarEjerciciosPorDefecto(db);
    } catch (e) {
      print('! Error en _onCreate: $e');
      rethrow;
    }
  }

  Future<void> insertarEjerciciosPorDefecto(Database db) async {
    try {
      print('\n=== Iniciando inserción de datos por defecto ===');
      
      // Verificar si ya existen ejercicios
      final ejerciciosExistentes = await db.query('ejercicios');
      if (ejerciciosExistentes.isNotEmpty) {
        print('! Ya existen ${ejerciciosExistentes.length} ejercicios en la base de datos');
        return;
      }

      print('\n=== Insertando ejercicios predeterminados ===');
      final ejercicios = [
        {
          'id': '1',
          'nombre': 'Sentadillas',
          'categoria': 'Piernas',
          'descripcion': 'Ejercicio básico para fortalecer piernas y glúteos',
          'imagen': 'assets/images/ejercicios/sentadillas.jpg',
          'musculos': 'Cuádriceps,Glúteos,Isquiotibiales',
          'nivel': 'Principiante',
          'series': 3,
          'repeticiones': 12,
          'notas': 'Mantén la espalda recta y los pies separados al ancho de los hombros',
          'tipo': 'ejercicio'
        },
        {
          'id': '2',
          'nombre': 'Flexiones',
          'categoria': 'Pecho',
          'descripcion': 'Ejercicio para pecho, hombros y tríceps',
          'imagen': 'assets/images/ejercicios/flexiones.jpg',
          'musculos': 'Pectorales,Deltoides,Tríceps',
          'nivel': 'Principiante',
          'series': 3,
          'repeticiones': 10,
          'notas': 'Mantén el cuerpo recto y los codos cerca del cuerpo',
          'tipo': 'ejercicio'
        },
        {
          'id': '3',
          'nombre': 'Plancha',
          'categoria': 'Core',
          'descripcion': 'Ejercicio isométrico para fortalecer el core',
          'imagen': 'assets/images/ejercicios/plancha.jpg',
          'musculos': 'Abdominales,Oblicuos,Espalda baja',
          'nivel': 'Principiante',
          'series': 3,
          'repeticiones': 30,
          'notas': 'Mantén el cuerpo recto y contrae el abdomen',
          'tipo': 'ejercicio'
        }
      ];

      // Insertar ejercicios uno por uno con verificación
      for (var ejercicio in ejercicios) {
        try {
          await db.insert('ejercicios', ejercicio);
          print('✓ Ejercicio insertado: ${ejercicio['nombre']} (ID: ${ejercicio['id']})');
          
          // Verificar que se insertó correctamente
          final ejercicioInsertado = await db.query(
            'ejercicios',
            where: 'id = ?',
            whereArgs: [ejercicio['id']],
          );
          
          if (ejercicioInsertado.isEmpty) {
            print('! Error: El ejercicio ${ejercicio['nombre']} no se encontró después de insertarlo');
          }
        } catch (e) {
          print('! Error insertando ejercicio ${ejercicio['nombre']}: $e');
        }
      }

      // Verificación final
      final count = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM ejercicios'));
      print('\n=== Resumen de inserción ===');
      print('Total de ejercicios insertados: $count');
      
      if (count == ejercicios.length) {
        print('✓ Todos los ejercicios se insertaron correctamente');
      } else {
        print('! Advertencia: Se esperaban ${ejercicios.length} ejercicios pero se insertaron $count');
      }
      
      // Mostrar todos los ejercicios insertados
      final ejerciciosFinales = await db.query('ejercicios');
      print('\n=== Ejercicios en la base de datos ===');
      for (var e in ejerciciosFinales) {
        print('- ${e['nombre']} (ID: ${e['id']})');
      }
      print('=====================================\n');
    } catch (e) {
      print('! Error crítico en insertarEjerciciosPorDefecto: $e');
      rethrow;
    }
  }

  Future<void> resetDatabase() async {
    try {
      print('\n=== Iniciando reinicio de base de datos ===');
      final dbPath = await getDatabasesPath();
      final path = join(dbPath, _dbName);
      
      // 1. Cerrar la base de datos si está abierta
      if (_database != null) {
        await _database!.close();
        _database = null;
        print('✓ Base de datos cerrada');
      }
      
      // 2. Eliminar el archivo de la base de datos
      await deleteDatabase(path);
      print('✓ Archivo de base de datos eliminado');
      
      // 3. Reinicializar la base de datos
      _database = await openDatabase(
        path,
        version: 1,
        onCreate: _onCreate,
      );
      print('✓ Base de datos reinicializada');
      
      // 4. Verificar que las tablas se crearon
      final tables = await _database!.query('sqlite_master', where: 'type = ?', whereArgs: ['table']);
      print('\n=== Tablas creadas ===');
      for (var table in tables) {
        if (table['name'] != 'android_metadata' && table['name'] != 'sqlite_sequence') {
          print('- ${table['name']}');
        }
      }

      // 5. Verificar ejercicios
      final ejercicios = await _database!.query('ejercicios');
      print('\n=== Verificación de ejercicios ===');
      print('Ejercicios en la base de datos: ${ejercicios.length}');
      for (var e in ejercicios) {
        print('- ${e['nombre']} (ID: ${e['id']})');
      }
      print('=====================================\n');
    } catch (e) {
      print('! Error crítico en resetDatabase: $e');
      throw Exception('Error al reiniciar la base de datos: $e');
    }
  }

  Future<User?> getUser(String email, String password) async {
    try {
      final db = await database;
      final List<Map<String, dynamic>> maps = await db.query(
        'users',
        where: 'email = ? AND password = ?',
        whereArgs: [email, password],
      );

      if (maps.isEmpty) return null;
      return User.fromJson(maps.first);
    } catch (e) {
      print('Error en getUser: $e');
      return null;
    }
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
} 