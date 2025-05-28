# TENA_FIT - Aplicación de Fitness y Bienestar

TENA_FIT es una aplicación completa de fitness y bienestar que consta de tres componentes principales: una aplicación web (frontend), un servidor backend con base de datos JSON, y una aplicación móvil para Android/iOS.

## 🚀 Estructura del Proyecto

```
TENA_FIT/
├── frontend/          # Aplicación web React + Vite + TypeScript
├── backend/          # Servidor Node.js + Express + JSON DB
│   └── src/
│       └── data/    # Archivos JSON como base de datos
│           ├── users.json
│           ├── ejercicios.json
│           ├── rutinas.json
│           └── progreso.json
└── app_android/     # Aplicación móvil Flutter
```

## 💻 Requisitos Previos

- Node.js >= 18.x
- Flutter SDK >= 3.2.3
- npm o yarn
- Git

## 🛠 Configuración y Ejecución

### Frontend (Web)

```bash
cd frontend
npm install
npm run dev
```

La aplicación web estará disponible en `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Aplicación Móvil

```bash
cd app_android
flutter pub get
flutter run
```

## 🔑 Credenciales de Administrador

```
Usuario: admin@tenafit.com
Contraseña: admin123
```

## 📚 Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- TypeScript
- Chakra UI
- React Router DOM
- Axios

### Backend
- Node.js
- Express
- Sistema de archivos JSON como base de datos
- JWT para autenticación
- bcrypt para encriptación

### App Móvil
- Flutter
- Provider para gestión de estado
- SQLite para almacenamiento local
- Material Design

## 🗄️ Estructura de la Base de Datos (JSON)

### users.json
- Almacena información de usuarios
- Roles: admin, cliente
- Datos básicos: id, nombre, email, password, rol

### ejercicios.json
- Catálogo de ejercicios disponibles
- Incluye: nombre, categoría, descripción, imagen, músculos trabajados, nivel

### rutinas.json
- Rutinas predefinidas
- Contiene: nombre, descripción, nivel, duración, días, ejercicios asociados

### progreso.json
- Seguimiento del progreso de usuarios
- Tipos: peso, ejercicio, objetivo, ejercicio_asignado
- Métricas y registros de entrenamiento

## 🔒 Variables de Entorno

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```
PORT=3000
JWT_SECRET=tu_secreto_jwt
```

## 📱 Características Principales

- Autenticación y autorización de usuarios
- Seguimiento de rutinas de ejercicio
- Registro de progreso
- Planes de nutrición
- Estadísticas y análisis
- Sincronización multiplataforma

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Autores

- Angel - Desarrollador Principal

