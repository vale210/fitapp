import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/ejercicio_provider.dart';
import '../providers/progreso_provider.dart';
import '../models/ejercicio_model.dart';
import '../models/progreso_model.dart';
import 'package:go_router/go_router.dart';
import '../helpers/database_helper.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  State<UserDashboardScreen> createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  int _selectedIndex = 0;
  bool _isLoading = false;
  List<Ejercicio> _ejerciciosAsignados = [];
  Progreso? _progreso;
  final _pesoController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _pesoController.dispose();
    super.dispose();
  }

  void _loadData() async {
    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.currentUser?.id;
      
      if (userId != null) {
        print('Cargando datos para el usuario: $userId');
        
        // Cargar ejercicios
        final ejercicioProvider = Provider.of<EjercicioProvider>(context, listen: false);
        final ejercicios = await ejercicioProvider.getEjerciciosAsignados(userId);
        print('Ejercicios cargados: ${ejercicios.length}');

        // Cargar progreso
        final progresoProvider = Provider.of<ProgresoProvider>(context, listen: false);
        final progreso = await progresoProvider.getProgresoPersonal(userId);
        print('Progreso cargado');
        
        if (mounted) {
          setState(() {
            _ejerciciosAsignados = ejercicios;
            _progreso = progreso;
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      print('Error cargando datos: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error cargando datos: ${e.toString()}')),
        );
        setState(() => _isLoading = false);
      }
    }
  }

  void _registrarPeso() async {
    if (_pesoController.text.isEmpty) return;

    final peso = double.tryParse(_pesoController.text);
    if (peso == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un peso válido')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.currentUser?.id;
      
      if (userId != null) {
        final success = await Provider.of<ProgresoProvider>(context, listen: false)
            .registrarPeso(userId, peso);
            
        if (success) {
          _pesoController.clear();
          _loadData();
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Peso registrado correctamente')),
            );
          }
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error registrando peso: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Widget _buildEjerciciosAsignados() {
    if (_ejerciciosAsignados.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.fitness_center, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'No tienes ejercicios asignados',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _ejerciciosAsignados.length,
      itemBuilder: (context, index) {
        final ejercicio = _ejerciciosAsignados[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (ejercicio.imagen != null)
                Image.network(
                  ejercicio.imagen!,
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      width: double.infinity,
                      height: 200,
                      color: Colors.grey[300],
                      child: const Icon(Icons.fitness_center, size: 64),
                    );
                  },
                ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            ejercicio.nombre,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: ejercicio.nivel == 'principiante' ? Colors.green : Colors.orange,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            ejercicio.nivel.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      ejercicio.descripcion,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.fitness_center, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          '${ejercicio.series} series x ${ejercicio.repeticiones} repeticiones',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    if (ejercicio.notas != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        'Notas: ${ejercicio.notas}',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildEstadisticas() {
    if (_progreso == null) return const SizedBox.shrink();

    final cambioColor = _progreso!.cambio > 0 ? Colors.green : (_progreso!.cambio < 0 ? Colors.red : Colors.grey);
    final cambioIcon = _progreso!.cambio > 0 ? Icons.arrow_upward : (_progreso!.cambio < 0 ? Icons.arrow_downward : Icons.remove);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Estadísticas',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Peso Inicial',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        '${_progreso!.pesoInicial.toStringAsFixed(1)} kg',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Peso Actual',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        '${_progreso!.pesoActual.toStringAsFixed(1)} kg',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Cambio',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      Row(
                        children: [
                          Icon(cambioIcon, color: cambioColor, size: 16),
                          const SizedBox(width: 4),
                          Text(
                            '${_progreso!.cambio.abs().toStringAsFixed(1)} kg',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: cambioColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Asistencia (último mes)',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        '${_progreso!.asistenciaPorcentaje.toStringAsFixed(0)}%',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgreso() {
    final progreso = _progreso;
    final hasValidWeight = progreso?.valor != null && (progreso?.valor ?? 0) > 0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Registro de Peso',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (hasValidWeight && progreso != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      'Último peso registrado: ${progreso.valor!.toStringAsFixed(1)} kg',
                      style: const TextStyle(fontSize: 16),
                    ),
                    Text(
                      'Fecha: ${progreso.fecha.toLocal().toString().split('.')[0]}',
                      style: const TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                  ],
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _pesoController,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Peso (kg)',
                            border: OutlineInputBorder(),
                            hintText: 'Ejemplo: 70.5',
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      ElevatedButton(
                        onPressed: _isLoading ? null : _registrarPeso,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).primaryColor,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                ),
                              )
                            : const Text('Registrar'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _buildEstadisticas(),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Progreso'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.restart_alt),
            onPressed: () async {
              setState(() => _isLoading = true);
              try {
                await DatabaseHelper.instance.resetDatabase();
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Base de datos reiniciada')),
                  );
                  context.go('/login');
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: ${e.toString()}')),
                  );
                }
              } finally {
                if (mounted) {
                  setState(() => _isLoading = false);
                }
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Provider.of<AuthProvider>(context, listen: false).logout();
              context.go('/login');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : IndexedStack(
              index: _selectedIndex,
              children: [
                _buildEjerciciosAsignados(),
                _buildProgreso(),
              ],
            ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: 'Ejercicios',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.show_chart),
            label: 'Progreso',
          ),
        ],
      ),
    );
  }
}