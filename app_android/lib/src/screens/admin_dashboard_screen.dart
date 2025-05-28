import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/ejercicio_provider.dart';
import '../models/user_model.dart';
import '../models/ejercicio_model.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 0;
  bool _isLoading = false;
  List<User> _users = [];
  List<Ejercicio> _ejercicios = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final users = await Provider.of<AuthProvider>(context, listen: false).getUsers();
      final ejercicios = await Provider.of<EjercicioProvider>(context, listen: false).getEjercicios();
      setState(() {
        _users = users;
        _ejercicios = ejercicios;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al cargar datos: ${e.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Widget _buildUsersList() {
    return ListView.builder(
      itemCount: _users.length,
      itemBuilder: (context, index) {
        final user = _users[index];
        return ListTile(
          leading: CircleAvatar(
            child: Text(user.nombre[0].toUpperCase()),
          ),
          title: Text(user.nombre),
          subtitle: Text(user.email),
          trailing: PopupMenuButton(
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'edit',
                child: Text('Editar'),
              ),
              const PopupMenuItem(
                value: 'delete',
                child: Text('Eliminar'),
              ),
            ],
            onSelected: (value) {
              if (value == 'edit') {
                // TODO: Implementar edición
              } else if (value == 'delete') {
                // TODO: Implementar eliminación
              }
            },
          ),
        );
      },
    );
  }

  Widget _buildEjerciciosList() {
    return ListView.builder(
      itemCount: _ejercicios.length,
      itemBuilder: (context, index) {
        final ejercicio = _ejercicios[index];
        return ListTile(
          leading: ejercicio.imagen != null
              ? Image.network(
                  ejercicio.imagen!,
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                )
              : const Icon(Icons.fitness_center),
          title: Text(ejercicio.nombre),
          subtitle: Text(ejercicio.categoria),
          trailing: PopupMenuButton(
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'edit',
                child: Text('Editar'),
              ),
              const PopupMenuItem(
                value: 'delete',
                child: Text('Eliminar'),
              ),
            ],
            onSelected: (value) {
              if (value == 'edit') {
                // TODO: Implementar edición
              } else if (value == 'delete') {
                // TODO: Implementar eliminación
              }
            },
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel de Administración'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Provider.of<AuthProvider>(context, listen: false).logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : IndexedStack(
              index: _selectedIndex,
              children: [
                _buildUsersList(),
                _buildEjerciciosList(),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Implementar creación según la pestaña seleccionada
        },
        child: const Icon(Icons.add),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'Usuarios',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: 'Ejercicios',
          ),
        ],
      ),
    );
  }
} 