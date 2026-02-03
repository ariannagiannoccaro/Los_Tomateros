# 🎓 EventUni - Plataforma de Gestión de Eventos Universitarios

## Equipo de trabajo y roles:
- **Arianna Valentina Giannoccaro Quiñonez** - Responsable de la BD
- **Elena Tatiana Soriano Vega** - Analista 
- **María Cruz Camargo Araujo** - Desarrollador Front
- **Gabriel Iván Villafuerte Armenta** - Tester y documentación técnica
- **Guillermo Álvarez Sanchéz** - Desarrollador Back
- **Cristopher Yanhyu Muñoz Prado** - Líder de equipo

---

![EventUni Banner](https://img.shields.io/badge/EventUni-v1.0.0-6366f1?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)

## 📋 Descripción

**EventUni** es una plataforma web completa para crear, inscribir y gestionar eventos universitarios como charlas, talleres, ferias, conferencias y seminarios. El sistema incluye calendario compartido, registro de asistencia mediante códigos QR, sistema de notificaciones y dashboard administrativo con reportes.

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login con múltiples roles (Admin, Organizador, Estudiante)
- Gestión de sesiones con persistencia en localStorage
- Permisos diferenciados por rol

### 📊 Dashboard Principal
- Estadísticas en tiempo real
- Gráficos interactivos (barras y pie charts)
- Métricas de eventos, inscripciones y asistencia
- Lista de próximos eventos

### 📅 Gestión de Eventos (CRUD)
- Crear, editar, visualizar y eliminar eventos
- **Tipos de eventos:**
  - 💬 Charlas
  - 🔧 Talleres
  - 🎪 Ferias
  - 🎤 Conferencias
  - 📚 Seminarios
- Estados: Programado, En curso, Finalizado, Cancelado
- Sistema de etiquetas (tags)
- Control de capacidad

### 📆 Calendario Interactivo
- Vista mensual con navegación
- Eventos visualizados por día
- Código de colores por tipo de evento
- Panel lateral con detalles del día seleccionado

### 📱 Sistema de QR
- Generación automática de códigos QR para inscripciones
- Escáner de QR para registro de asistencia (check-in)
- Simulación de escaneo para demostración
- Exportación de códigos QR

### 📋 Mis Inscripciones
- Lista de eventos inscritos (próximos y pasados)
- Acceso rápido a códigos QR personales
- Estado de asistencia (confirmado/pendiente)

### 📈 Reportes y Estadísticas
- Gráficos de inscripciones por evento
- Distribución por tipo de evento
- Tabla detallada con filtros
- **Exportación a CSV**

### 👥 Gestión de Usuarios (Solo Admin)
- Lista completa de usuarios
- Filtros por rol y búsqueda
- Agregar nuevos usuarios
- Estadísticas por tipo de usuario

### ⚙️ Configuración
- Notificaciones (email, push, recordatorios)
- Privacidad del perfil
- Apariencia (tema, idioma)

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Marcar como leídas
- Historial de notificaciones

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 19.x | Biblioteca para interfaces de usuario |
| **TypeScript** | 5.x | Superset tipado de JavaScript |
| **Vite** | 7.x | Build tool y dev server |
| **Tailwind CSS** | 4.x | Framework de CSS utilitario |
| **React Router DOM** | 7.x | Enrutamiento para React |
| **Zustand** | 5.x | Gestión de estado global |
| **Recharts** | 3.x | Librería de gráficos |
| **qrcode.react** | 4.x | Generación de códigos QR |
| **date-fns** | 4.x | Utilidades para fechas |
| **Lucide React** | 0.563.x | Iconos SVG |

---

## 📁 Estructura del Proyecto

```
eventuni/
├── 📄 index.html              # HTML principal
├── 📄 package.json            # Dependencias y scripts
├── 📄 tsconfig.json           # Configuración TypeScript
├── 📄 vite.config.ts          # Configuración de Vite
├── 📄 README.md               # Documentación
└── 📁 src/
    ├── 📄 main.tsx            # Punto de entrada
    ├── 📄 App.tsx             # Componente principal con rutas
    ├── 📄 index.css           # Estilos globales (Tailwind)
    ├── 📁 components/
    │   └── 📄 Layout.tsx      # Layout principal con sidebar
    ├── 📁 pages/
    │   ├── 📄 Login.tsx       # Página de inicio de sesión
    │   ├── 📄 Dashboard.tsx   # Dashboard con estadísticas
    │   ├── 📄 Events.tsx      # Lista de eventos
    │   ├── 📄 EventDetail.tsx # Detalle de evento
    │   ├── 📄 EventForm.tsx   # Crear/Editar evento
    │   ├── 📄 Calendar.tsx    # Calendario de eventos
    │   ├── 📄 MyEvents.tsx    # Mis inscripciones
    │   ├── 📄 Scanner.tsx     # Escáner de QR
    │   ├── 📄 Reports.tsx     # Reportes y estadísticas
    │   ├── 📄 Users.tsx       # Gestión de usuarios
    │   └── 📄 Settings.tsx    # Configuración
    ├── 📁 store/
    │   └── 📄 useStore.ts     # Estado global (Zustand)
    ├── 📁 types/
    │   └── 📄 index.ts        # Definiciones TypeScript
    └── 📁 utils/
        └── 📄 cn.ts           # Utilidad para clases CSS
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **Node.js** 18.x o superior
- **npm** 9.x o superior (o yarn/pnpm)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/eventuni.git
   cd eventuni
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

4. **Construir para producción**
   ```bash
   npm run build
   ```
   Los archivos se generarán en la carpeta `dist/`

5. **Previsualizar build de producción**
   ```bash
   npm run preview
   ```

---

## 👥 Usuarios de Demostración

La aplicación incluye 3 usuarios de prueba preconfigurados:

| Rol | Nombre | Email | Contraseña |
|-----|--------|-------|------------|
| **Administrador** | Dr. Carlos Mendoza | admin@eventuni.edu | *(cualquiera)* |
| **Organizador** | Prof. María García | organizador@eventuni.edu | *(cualquiera)* |
| **Estudiante** | Juan Pérez | estudiante@eventuni.edu | *(cualquiera)* |

> ⚠️ **Nota:** En esta versión demo, la validación de contraseña está deshabilitada. Solo se verifica el email.

### Permisos por Rol

| Funcionalidad | Estudiante | Organizador | Admin |
|---------------|:----------:|:-----------:|:-----:|
| Ver eventos | ✅ | ✅ | ✅ |
| Inscribirse a eventos | ✅ | ✅ | ✅ |
| Ver su QR | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Editar sus eventos | ❌ | ✅ | ✅ |
| Escanear QR (check-in) | ❌ | ✅ | ✅ |
| Ver reportes | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Configuración global | ❌ | ❌ | ✅ |

---

## 📱 Funcionalidades Detalladas

### Registro y Check-in con QR

1. **Inscripción:** El usuario se inscribe a un evento desde la página de detalle
2. **Generación QR:** Se genera automáticamente un código QR único
3. **Acceso al QR:** Disponible en "Mis Inscripciones" o en el detalle del evento
4. **Check-in:** El organizador escanea el QR usando el módulo Scanner
5. **Confirmación:** El sistema registra la hora de check-in

### Flujo de Creación de Eventos

1. Ir a **Eventos** → **Crear Evento**
2. Completar el formulario:
   - Título y descripción
   - Tipo de evento
   - Fecha, hora de inicio y fin
   - Ubicación
   - Capacidad máxima
   - Etiquetas (opcional)
3. Guardar el evento
4. El evento aparecerá en el calendario y lista de eventos

### Exportación de Reportes

1. Ir a **Reportes**
2. Filtrar por evento si es necesario
3. Clic en **Exportar CSV**
4. Se descarga un archivo con todos los datos de asistencia

---

## 📅 Roadmap del Proyecto (Hitos por Semanas)

| Semanas | Hito | Entregables |
|:-------:|------|-------------|
| **1-2** | Requisitos + Diseño DB | Modelo de datos (eventos, usuarios, asistencias) |
| **3-6** | CRUD Eventos + Calendario | Frontend + Backend funcional |
| **7-10** | Registro QR + Escaneo | Sistema de códigos QR completo |
| **11-14** | Notificaciones + Reportes | Sistema de alertas y estadísticas |
| **15-16** | Pruebas + Admin Dashboard | Testing y panel administrativo |

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 🗄️ Modelo de Datos

### Event (Evento)
```typescript
{
  id: string;
  title: string;
  description: string;
  type: 'charla' | 'taller' | 'feria' | 'conferencia' | 'seminario';
  status: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  organizerId: string;
  createdAt: string;
  tags: string[];
}
```

### User (Usuario)
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizador' | 'estudiante';
  faculty: string;
  createdAt: string;
}
```

### Attendance (Asistencia)
```typescript
{
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  qrCode: string;
}
```

### Notification (Notificación)
```typescript
{
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  eventId?: string;
}
```

---

## 💾 Persistencia de Datos

La aplicación utiliza **localStorage** para persistir los datos del estado mediante Zustand. Esto significa que:

- ✅ Los datos se mantienen al recargar la página
- ✅ Las inscripciones y check-ins persisten
- ✅ Los nuevos eventos creados se guardan
- ⚠️ Los datos se pierden al limpiar el almacenamiento del navegador

Para una implementación de producción, se recomienda conectar con un backend (Laravel, Flask, Node.js, etc.) y una base de datos real (MySQL, PostgreSQL, MongoDB).

---

## 🎨 Capturas de Pantalla

### Dashboard
- Vista general con estadísticas
- Gráficos de asistencia y tipos de eventos
- Lista de próximos eventos

### Calendario
- Vista mensual interactiva
- Eventos codificados por color
- Panel de detalles del día

### Generador de QR
- Código QR único por inscripción
- Información del evento integrada
- Opción de descarga

---

## 🔜 Mejoras Futuras

- [ ] Integración con backend real (API REST)
- [ ] Autenticación OAuth (Google, Microsoft)
- [ ] Notificaciones push reales (Web Push API)
- [ ] Modo oscuro completo
- [ ] Exportación a PDF
- [ ] Integración con calendarios externos (Google Calendar, Outlook)
- [ ] App móvil (React Native)
- [ ] Sistema de comentarios/valoraciones de eventos
- [ ] Recordatorios por email

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad universitaria.

---

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: soporte@eventuni.edu
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/eventuni/issues)

---

<p align="center">
  <strong>EventUni</strong> - Conectando la comunidad universitaria a través de eventos 🎓
</p>

