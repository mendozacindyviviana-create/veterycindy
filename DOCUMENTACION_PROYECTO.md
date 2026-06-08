# Documentacion del proyecto VeteryCindy

## 1. Vision general

VeteryCindy es una aplicacion web full-stack para una clinica veterinaria. El proyecto esta separado en dos aplicaciones:

- `frontend/`: cliente web construido con React, Vite, React Router, Tailwind CSS y Axios.
- `backend/`: API REST construida con Node.js, Express, Sequelize, MySQL, JWT y bcrypt.

La aplicacion cubre cinco flujos principales:

1. Pagina publica de la clinica con informacion de servicios, galeria, contacto y formulario de solicitud de cita.
2. Registro e inicio de sesion de usuarios.
3. Portal de cliente para registrar mascotas, agendar citas y revisar historial.
4. Portal de veterinario para revisar agenda y registrar historia clinica, diagnostico y tratamiento.
5. Portal de cajero para procesar pagos simulados y confirmar citas.

Tambien existe un rol `ADMIN` que puede acceder a las secciones principales y simular los paneles de cliente, veterinario y cajero.

### 1.1 Guia de conceptos para entender el proyecto

Esta seccion esta pensada para un desarrollador que esta comenzando. La idea es que no solo sepas "que archivo tocar", sino tambien por que existe cada parte.

#### Que significa full-stack

Una aplicacion full-stack tiene dos grandes lados:

- Frontend: lo que ve y usa la persona en el navegador. En este proyecto es React.
- Backend: el servidor que recibe solicitudes, valida datos, consulta la base de datos y responde. En este proyecto es Express.

Ejemplo sencillo:

1. El usuario escribe su correo y contrasena en el formulario de login.
2. El frontend toma esos datos y los envia al backend.
3. El backend revisa si existen y si la contrasena es correcta.
4. El backend responde con un token.
5. El frontend guarda ese token y lo usa para futuras peticiones.

#### Que es una API REST

Una API REST es una forma ordenada de exponer acciones del backend mediante URLs y metodos HTTP.

- `GET` se usa normalmente para consultar.
- `POST` se usa normalmente para crear.
- `PUT` se usa normalmente para actualizar.
- `DELETE` se usa normalmente para eliminar.

Ejemplo del proyecto:

```text
POST /api/auth/login
```

Ese endpoint significa: "quiero enviar datos al servidor para iniciar sesion".

Otro ejemplo:

```text
GET /api/appointments
```

Ese endpoint significa: "quiero consultar las citas que puede ver el usuario autenticado".

#### Que es un componente React

Un componente React es una pieza reutilizable de interfaz. Puede ser una pagina completa, una barra de navegacion, un formulario o una tarjeta.

Ejemplo conceptual:

```jsx
function BotonGuardar() {
  return <button>Guardar</button>;
}
```

En este proyecto:

- `Navbar.jsx` es un componente porque encapsula la barra superior.
- `ClientDashboard.jsx` es un componente porque encapsula todo el panel del cliente.
- `ContactForm.jsx` es un componente porque encapsula el formulario publico de contacto.

#### Que es el estado en React

El estado es informacion que puede cambiar mientras el usuario usa la pagina.

Ejemplos del proyecto:

- `loading`: indica si algo esta cargando.
- `error`: guarda un mensaje de error para mostrarlo.
- `showAddPet`: decide si el formulario de registrar mascota se muestra o no.
- `paymentForm`: guarda los datos temporales del formulario de pago.

Cuando el estado cambia, React vuelve a pintar la parte de la pantalla que depende de ese estado.

#### Que es un hook

Un hook es una funcion especial de React para usar capacidades internas.

Hooks usados en el proyecto:

- `useState`: guarda estado.
- `useEffect`: ejecuta codigo cuando el componente carga o cuando cambia algo.
- `useRef`: guarda una referencia a un elemento del DOM, por ejemplo para hacer scroll hasta un formulario.
- `useNavigate`: permite navegar por rutas desde codigo.
- `useLocation`: permite saber en que ruta esta el usuario.

#### Que es autenticacion y autorizacion

Autenticacion significa comprobar quien eres. Ejemplo: iniciar sesion con correo y contrasena.

Autorizacion significa comprobar que puedes hacer. Ejemplo: un cliente no deberia entrar al panel de cajero.

En este proyecto:

- La autenticacion usa JWT.
- La autorizacion usa roles: `CLIENT`, `VET`, `CASHIER`, `ADMIN`.

#### Que es JWT

JWT significa JSON Web Token. Es una cadena de texto firmada por el backend. Sirve para que el frontend pueda decir en cada peticion: "soy este usuario y ya inicie sesion".

Flujo:

1. El usuario hace login.
2. El backend devuelve un token.
3. El frontend guarda el token en `localStorage`.
4. Axios envia el token en el header `Authorization`.
5. El backend verifica el token antes de permitir rutas protegidas.

Header usado:

```text
Authorization: Bearer <token>
```

#### Que es una base de datos relacional

Una base de datos relacional guarda informacion en tablas. Cada tabla representa un tipo de dato.

En este proyecto:

- `users` guarda usuarios.
- `patients` guarda mascotas.
- `appointments` guarda citas.
- `contact_messages` guarda mensajes del formulario publico.

Las tablas se relacionan con llaves foraneas. Por ejemplo, `patients.owner_id` apunta a `users.id`, porque una mascota pertenece a un usuario.

#### Que es Sequelize

Sequelize es un ORM. Un ORM permite trabajar con tablas de base de datos usando codigo JavaScript en vez de escribir SQL manual todo el tiempo.

Ejemplo conceptual:

```js
User.findOne({ where: { email } })
```

Eso equivale a buscar un usuario por correo en la tabla `users`.

#### Por que hay routes, controllers y services

El backend esta separado por responsabilidades para que el codigo sea mas facil de entender y mantener.

- Routes: definen la URL y que middlewares se ejecutan.
- Controllers: reciben la peticion y devuelven la respuesta.
- Services: contienen la logica de negocio.
- Models: describen las tablas.

Ejemplo con login:

```text
auth.routes.js -> AuthController.js -> AuthService.js -> User.js -> MySQL
```

Esto evita que un solo archivo tenga demasiadas responsabilidades.

## 2. Estructura del repositorio

```text
veterycindy/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── app.js
│   │   ├── create-db.js
│   │   ├── config/
│   │   │   ├── constants.js
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── AppointmentController.js
│   │   │   ├── AuthController.js
│   │   │   ├── ContactController.js
│   │   │   └── PatientController.js
│   │   ├── docs/
│   │   │   └── swagger.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   ├── ContactMessage.js
│   │   │   ├── Patient.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── appointment.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── contact.routes.js
│   │   │   └── patient.routes.js
│   │   ├── seeders/
│   │   │   └── seed.js
│   │   └── services/
│   │       ├── AppointmentService.js
│   │       ├── AuthService.js
│   │       ├── ContactService.js
│   │       └── PatientService.js
│   └── tests/
│       ├── api.test.js
│       ├── run-tests.js
│       └── setup.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── common/
│       │   ├── dashboard/
│       │   └── landing/
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       └── services/
├── README.md
└── DOCUMENTACION_PROYECTO.md
```

## 3. Frontend

### 3.1 Tecnologias principales

- React 19 como libreria de UI.
- Vite como servidor de desarrollo y empaquetador.
- React Router para rutas publicas y privadas.
- Axios para consumir la API REST.
- SweetAlert2 para mostrar confirmaciones, exitos y errores mas visuales en acciones importantes como pagos.
- Tailwind CSS y clases utilitarias para estilos.
- `localStorage` para persistir token JWT y datos basicos del usuario.

### 3.2 Punto de entrada

`frontend/src/main.jsx` monta la aplicacion React en el elemento `#root` definido en `frontend/index.html`.

`frontend/src/App.jsx` define el arbol principal:

- Envuelve toda la app con `AuthProvider`.
- Define `BrowserRouter`.
- Declara rutas publicas: `/`, `/login`, `/register`.
- Declara rutas protegidas: `/dashboard`, `/dashboard/admin`, `/dashboard/client`, `/dashboard/vet`, `/dashboard/cashier`.
- Redirige cualquier ruta desconocida a `/`.

### 3.3 Rutas del frontend

| Ruta | Tipo | Componente | Descripcion |
|---|---|---|---|
| `/` | Publica | `Home` | Landing principal de VeteryCindy. |
| `/login` | Publica | `Login` | Formulario de inicio de sesion. |
| `/register` | Publica | `Register` | Registro de propietario/cliente. |
| `/dashboard` | Protegida | `Dashboard` | Panel segun rol; para admin muestra selector de simulacion. |
| `/dashboard/admin` | Protegida ADMIN | `Dashboard` | Alias del panel admin. |
| `/dashboard/client` | Protegida CLIENT/ADMIN | `Dashboard` | Panel de cliente o simulacion admin. |
| `/dashboard/vet` | Protegida VET/ADMIN | `Dashboard` | Panel veterinario o simulacion admin. |
| `/dashboard/cashier` | Protegida CASHIER/ADMIN | `Dashboard` | Panel cajero o simulacion admin. |

### 3.4 Autenticacion en frontend

`frontend/src/context/AuthContext.jsx` centraliza el estado de sesion.

Responsabilidades:

- Leer `vc_token` y `vc_user` desde `localStorage` al cargar.
- Exponer `user`, `token`, `loading`, `isAuthenticated`.
- Ejecutar `login(email, password)`.
- Ejecutar `register(data)`.
- Ejecutar `logout()`.
- Actualizar el usuario en memoria y en `localStorage`.

Cuando el usuario inicia sesion, el backend devuelve:

```json
{
  "user": {
    "id": 1,
    "first_name": "Maria",
    "last_name": "Gomez",
    "email": "maria@email.com",
    "role": "CLIENT"
  },
  "token": "jwt..."
}
```

El token se guarda como `vc_token` y se adjunta automaticamente en cada request por el interceptor de Axios.

### 3.5 Axios y servicios

`frontend/src/services/api.js` crea una instancia Axios con base URL:

```js
import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
```

Interceptors:

- Request: si existe `vc_token`, agrega `Authorization: Bearer <token>`.
- Response: si la API responde `401`, borra sesion local y redirige a `/login`.

`frontend/src/services/endpoints.js` agrupa funciones por dominio:

- `authService`: login, register, profile.
- `appointmentService`: citas, notas clinicas, pagos y cancelacion.
- `patientService`: mascotas/pacientes.
- `contactService`: mensajes del formulario publico.

### 3.6 Componentes comunes

#### `Navbar.jsx`

Barra de navegacion global.

Funciones:

- Mostrar logo y links publicos.
- Mostrar `Mi Panel` y `Salir` si el usuario esta autenticado.
- Mostrar `Iniciar sesion` y `Registrarse` si no hay sesion.
- Navegar a secciones publicas usando hash navigation (`/#servicios`, `/#agendar`) incluso cuando el usuario esta dentro de un dashboard.

Si el usuario esta autenticado, los botones publicos no cierran sesion. El usuario puede revisar la pagina principal y volver a su panel con `Mi Panel`.

#### `ProtectedRoute.jsx`

Protege rutas privadas.

Comportamiento:

- Mientras `AuthContext` carga, muestra pantalla de carga.
- Si no hay sesion, redirige a `/login`.
- Si se definieron roles y el rol del usuario no esta permitido, redirige a `/`.
- Si todo es valido, renderiza el contenido protegido.

#### `Footer.jsx`

Pie de pagina con informacion de marca, datos de contacto, horarios y enlaces.

### 3.7 Pagina principal

`frontend/src/pages/Home.jsx` compone la landing:

- `Navbar`
- `Hero`
- barra de confianza
- `ServicesList`
- `WhyUs`
- galeria de pacientes
- `ContactForm`
- `Testimonials`
- CTA final
- `Footer`

Ademas escucha `location.hash`. Si la URL llega como `/#servicios` o `/#agendar`, busca el elemento con ese id y hace scroll suave.

### 3.8 Componentes landing

#### `Hero.jsx`

Primera pantalla de la web publica. Incluye:

- Imagen de fondo veterinaria.
- Titulo principal.
- Boton para agendar cita que baja a `#agendar`.
- Boton para ver servicios que baja a `#servicios`.
- Indicadores de confianza.

#### `ServicesList.jsx`

Seccion `id="servicios"`. Presenta servicios como consulta general, vacunacion, emergencias, esterilizacion, cirugias, odontologia, piel/alergias y control postoperatorio.

Tambien contiene la subseccion publica `id="costos"`, con tarifas de referencia para consulta general, vacunacion, dermatologia, esterilizacion y cirugia. Los costos finales se confirman en caja, donde se liquida el monto antes de aprobar el pago simulado.

#### `ContactForm.jsx`

Formulario publico de solicitud de cita.

Campos principales:

- Motivo de cita.
- Tipo de mascota.
- Fecha.
- Hora, excepto emergencias.
- Nombre.
- Celular.
- Correo.
- Observaciones.

Validaciones de frontend:

- Campos obligatorios.
- Fecha de lunes a sabado.
- Hora requerida si no es emergencia.

Al enviar, llama `POST /api/contact` y guarda un mensaje en `contact_messages`.

### 3.9 Paginas de autenticacion

#### `Login.jsx`

Formulario de inicio de sesion. Recibe correo y contrasena, llama `authService.login` y redirige segun rol:

- `CLIENT` -> `/dashboard/client`
- `VET` -> `/dashboard/vet`
- `CASHIER` -> `/dashboard/cashier`
- `ADMIN` -> `/dashboard`

Tambien incluye un enlace visible `Volver al inicio`, ademas del logo clickeable.

#### `Register.jsx`

Formulario de registro de cliente. Crea usuarios con rol `CLIENT`.

Tambien incluye un enlace visible `Volver al inicio`. Esto mejora la experiencia porque el usuario no queda atrapado en el formulario y no tiene que adivinar que el logo tambien sirve como enlace.

Campos:

- Nombre.
- Apellidos.
- Documento.
- Telefono.
- Correo.
- Direccion.
- Contrasena.
- Confirmacion de contrasena.

Valida que las contrasenas coincidan y luego llama `POST /api/auth/register`.

### 3.10 Dashboard por rol

`frontend/src/pages/Dashboard.jsx` lee el usuario desde `AuthContext` y decide que panel mostrar.

Si el usuario es `ADMIN`:

- En `/dashboard` o `/dashboard/admin` muestra el panel de seleccion.
- En `/dashboard/client` renderiza `ClientDashboard`.
- En `/dashboard/vet` renderiza `VetDashboard`.
- En `/dashboard/cashier` renderiza `CashierDashboard`.

Si el usuario no es admin, muestra el panel correspondiente a su rol.

### 3.11 Panel de cliente

`ClientDashboard.jsx` permite:

- Ver saludo y resumen.
- Registrar mascota.
- Agendar cita.
- Ver mascotas registradas.
- Ver citas e historial clinico disponible.
- Cancelar citas pendientes o confirmadas.

Flujo para registrar mascota:

1. Usuario pulsa `Registrar Mascota`.
2. Se abre el formulario.
3. La pantalla hace scroll directo al formulario.
4. Se envia `POST /api/patients`.
5. El panel recarga mascotas y citas.

Flujo para agendar cita:

1. Usuario pulsa `Agendar Cita`.
2. Se abre el formulario.
3. La pantalla hace scroll directo al formulario.
4. Selecciona mascota, motivo, fecha, hora y observaciones.
5. Se envia `POST /api/appointments`.
6. La cita queda con estado `PENDING` y pago `PENDING`.

### 3.12 Panel veterinario

`VetDashboard.jsx` permite:

- Ver agenda medica.
- Ver citas pendientes, confirmadas o completadas.
- Abrir formulario de atencion clinica.
- Guardar notas clinicas, diagnostico, tratamiento y fecha de control.

Flujo de atencion:

1. Veterinario pulsa `Iniciar Atencion & Guardar Diagnostico`.
2. Se selecciona la cita.
3. Se abre el formulario de historia clinica.
4. La pantalla hace scroll directo al formulario.
5. Al guardar, se llama `PUT /api/appointments/:id/clinical-notes`.
6. La cita se marca como `COMPLETED`.

El administrador puede usar este flujo cuando simula el panel veterinario.

### 3.13 Panel cajero

`CashierDashboard.jsx` permite:

- Ver citas con pago pendiente o aprobado.
- Abrir formulario de pago simulado.
- Prellenar datos de tarjeta y monto sugerido.
- Procesar pago.
- Confirmar visualmente el pago con SweetAlert2 antes de enviarlo al backend.
- Mostrar una alerta visual de exito o error segun la respuesta de la API.

Flujo de pago:

1. Cajero pulsa `Recibir Pago & Confirmar Cita`.
2. Se abre el formulario de pasarela simulada.
3. La pantalla hace scroll directo al formulario.
4. Al enviar el formulario, SweetAlert2 muestra una ventana de confirmacion.
5. Si el cajero confirma, se envia `POST /api/appointments/:id/payment` con `approved: true`.
6. El backend marca `payment_status` como `APPROVED`, genera referencia y cambia la cita a `CONFIRMED`.
7. Si todo sale bien, SweetAlert2 muestra un mensaje de exito. Si ocurre un error, muestra un mensaje de error con la respuesta del backend.

## 4. Backend

### 4.1 Tecnologias principales

- Node.js.
- Express 5.
- Sequelize ORM.
- MySQL.
- JWT para autenticacion.
- bcryptjs para hash de contrasenas.
- cors para permitir peticiones del frontend.
- swagger-jsdoc y swagger-ui-express para documentacion API.

### 4.2 `app.js`

`backend/src/app.js` configura la API:

- Carga variables con `dotenv`.
- Crea `express()`.
- Configura CORS usando `FRONTEND_URL` o `http://localhost:5173`.
- Habilita `express.json()` y `express.urlencoded()`.
- Monta Swagger en `/api-docs`.
- Monta rutas:
  - `/api/auth`
  - `/api/appointments`
  - `/api/patients`
  - `/api/contact`
- Expone health check en `/api/health`.
- Usa `errorHandler`.
- Autentica conexion MySQL.
- Sincroniza modelos con `sequelize.sync({ alter: true })`.
- Inicia servidor en `PORT` o `4000`.

### 4.3 Configuracion

#### `database.js`

Crea la instancia Sequelize:

```js
new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: { timestamps: true, underscored: true }
})
```

Valores por defecto:

- `DB_NAME=veterycindy`
- `DB_USER=root`
- `DB_PASSWORD=''`
- `DB_HOST=localhost`
- `DB_PORT=3306`

#### `constants.js`

Define constantes:

Roles:

- `CLIENT`
- `VET`
- `CASHIER`
- `ADMIN`

Estados de cita:

- `PENDING`
- `CONFIRMED`
- `PAID`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

Estados de pago:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `REFUNDED`

### 4.4 Middleware

#### `auth.js`

`authenticate`:

- Lee `Authorization`.
- Exige formato `Bearer <token>`.
- Verifica JWT con `JWT_SECRET`.
- Busca el usuario en base de datos.
- Rechaza si el usuario no existe o esta inactivo.
- Adjunta `req.user`.

`authorize(...roles)`:

- Debe ejecutarse despues de `authenticate`.
- Verifica que `req.user.role` este dentro de los roles permitidos.
- Si no coincide, responde `403`.

#### `errorHandler.js`

Devuelve errores JSON consistentes:

```json
{
  "success": false,
  "message": "Mensaje de error"
}
```

Tambien maneja errores de validacion Sequelize y errores compatibles con express-validator.

### 4.5 Patron backend

El backend sigue una separacion por capas:

- `routes/`: declara endpoints y middleware.
- `controllers/`: recibe `req`, llama servicios y responde JSON.
- `services/`: contiene logica de negocio.
- `models/`: define tablas y relaciones.
- `middleware/`: autenticacion/autorizacion y errores.

## 5. Base de datos

La base de datos se llama `veterycindy` por defecto. Sequelize sincroniza las tablas segun los modelos.

### 5.1 Tabla `users`

Modelo: `User.js`

Campos:

| Campo | Tipo | Detalle |
|---|---|---|
| `id` | INTEGER | PK autoincremental. |
| `first_name` | STRING(100) | Obligatorio. |
| `last_name` | STRING(100) | Obligatorio. |
| `email` | STRING(255) | Obligatorio, unico, formato email. |
| `password` | STRING(255) | Hash bcrypt. |
| `phone` | STRING(20) | Opcional. |
| `role` | ENUM | CLIENT, VET, CASHIER, ADMIN. |
| `document_id` | STRING(20) | Documento/cedula. |
| `address` | STRING(255) | Direccion. |
| `is_active` | BOOLEAN | Activo por defecto. |
| `specialty` | STRING(100) | Especialidad de veterinario. |
| `license_number` | STRING(50) | Licencia profesional veterinaria. |
| `created_at` | DATE | Generado por Sequelize. |
| `updated_at` | DATE | Generado por Sequelize. |

### 5.2 Tabla `patients`

Modelo: `Patient.js`

Representa mascotas/pacientes.

| Campo | Tipo | Detalle |
|---|---|---|
| `id` | INTEGER | PK autoincremental. |
| `name` | STRING(100) | Nombre de mascota. |
| `species` | STRING(50) | Perro, gato, ave, etc. |
| `breed` | STRING(100) | Raza. |
| `color` | STRING(50) | Color. |
| `birth_date` | DATEONLY | Fecha de nacimiento. |
| `weight` | DECIMAL(5,2) | Peso en kg. |
| `sex` | ENUM | MALE/FEMALE. |
| `microchip` | STRING(50) | Numero de microchip. |
| `allergies` | TEXT | Alergias. |
| `notes` | TEXT | Notas generales. |
| `owner_id` | INTEGER | FK a `users.id`. |
| `created_at` | DATE | Generado por Sequelize. |
| `updated_at` | DATE | Generado por Sequelize. |

### 5.3 Tabla `appointments`

Modelo: `Appointment.js`

Representa citas medicas, historia clinica y pago asociado.

| Campo | Tipo | Detalle |
|---|---|---|
| `id` | INTEGER | PK autoincremental. |
| `patient_id` | INTEGER | FK a `patients.id`. |
| `vet_id` | INTEGER | FK a `users.id`, veterinario asignado. |
| `client_id` | INTEGER | FK a `users.id`, propietario. |
| `reason` | STRING(255) | Motivo de cita. |
| `date` | DATEONLY | Fecha. |
| `time` | TIME | Hora, nullable para emergencias. |
| `status` | ENUM | Estado de la cita. |
| `payment_status` | ENUM | Estado del pago. |
| `payment_amount` | DECIMAL(12,2) | Monto COP. |
| `payment_reference` | STRING(100) | Referencia simulada. |
| `clinical_notes` | TEXT | Notas clinicas. |
| `diagnosis` | TEXT | Diagnostico. |
| `treatment` | TEXT | Tratamiento. |
| `follow_up_date` | DATEONLY | Fecha sugerida de control. |
| `observations` | TEXT | Observaciones del cliente. |
| `is_emergency` | BOOLEAN | Marca emergencia. |
| `created_at` | DATE | Generado por Sequelize. |
| `updated_at` | DATE | Generado por Sequelize. |

### 5.4 Tabla `contact_messages`

Modelo: `ContactMessage.js`

Guarda solicitudes publicas desde el formulario de landing.

| Campo | Tipo | Detalle |
|---|---|---|
| `id` | INTEGER | PK autoincremental. |
| `name` | STRING(200) | Nombre del solicitante. |
| `email` | STRING(255) | Correo, validado como email. |
| `phone` | STRING(20) | Telefono. |
| `pet_type` | STRING(50) | Tipo de mascota. |
| `reason` | STRING(255) | Motivo. |
| `preferred_date` | DATEONLY | Fecha preferida. |
| `preferred_time` | STRING(10) | Hora preferida. |
| `message` | TEXT | Mensaje libre. |
| `is_read` | BOOLEAN | Leido/no leido. |
| `created_at` | DATE | Generado por Sequelize. |
| `updated_at` | DATE | Generado por Sequelize. |

### 5.5 Relaciones Sequelize

Definidas en `models/index.js`:

- Un `User` cliente tiene muchas `Patient` como `pets`.
- Un `Patient` pertenece a un `User` como `owner`.
- Un `User` cliente tiene muchas `Appointment` como `clientAppointments`.
- Una `Appointment` pertenece a un cliente como `client`.
- Un `User` veterinario tiene muchas `Appointment` como `vetAppointments`.
- Una `Appointment` pertenece a un veterinario como `vet`.
- Un `Patient` tiene muchas `Appointment` como `appointments`.
- Una `Appointment` pertenece a un paciente como `patient`.

## 6. Endpoints

Todas las respuestas exitosas usan normalmente:

```json
{
  "success": true,
  "message": "Texto opcional",
  "data": {}
}
```

Los errores usan:

```json
{
  "success": false,
  "message": "Descripcion del error"
}
```

### 6.1 Health

#### `GET /api/health`

Publico.

Respuesta:

```json
{
  "success": true,
  "message": "VeteryCindy API is running ...",
  "timestamp": "2026-05-30T00:00:00.000Z"
}
```

### 6.2 Autenticacion

#### `POST /api/auth/register`

Publico.

Body:

```json
{
  "first_name": "Maria",
  "last_name": "Gomez",
  "email": "maria@email.com",
  "password": "Password123!",
  "phone": "3010000000",
  "role": "CLIENT",
  "document_id": "1020304050",
  "address": "Bogota"
}
```

Respuesta `201`:

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "data": {
    "user": { "id": 1, "email": "maria@email.com", "role": "CLIENT" },
    "token": "jwt..."
  }
}
```

Errores comunes:

- `409`: email ya registrado.
- `400`: error de validacion Sequelize.

#### `POST /api/auth/login`

Publico.

Body:

```json
{
  "email": "maria@email.com",
  "password": "Password123!"
}
```

Respuesta `200`:

```json
{
  "success": true,
  "message": "Inicio de sesion exitoso.",
  "data": {
    "user": { "id": 1, "email": "maria@email.com", "role": "CLIENT" },
    "token": "jwt..."
  }
}
```

Errores comunes:

- `401`: credenciales incorrectas.
- `403`: cuenta desactivada.

#### `GET /api/auth/profile`

Protegido con JWT.

Respuesta:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "Maria",
    "last_name": "Gomez",
    "email": "maria@email.com",
    "role": "CLIENT"
  }
}
```

#### `PUT /api/auth/profile`

Protegido con JWT.

Body permitido:

```json
{
  "first_name": "Maria Camila",
  "last_name": "Gomez",
  "phone": "3010000000",
  "address": "Bogota"
}
```

No permite cambiar `password` ni `role` por este endpoint.

### 6.3 Pacientes / mascotas

Todas las rutas requieren JWT.

#### `POST /api/patients`

Roles: `CLIENT`, `ADMIN`.

Body:

```json
{
  "name": "Luna",
  "species": "Perro",
  "breed": "Golden Retriever",
  "color": "Dorado",
  "birth_date": "2022-03-15",
  "weight": 28.5,
  "sex": "FEMALE",
  "microchip": "COL-001",
  "allergies": "Sensibilidad al pollo",
  "notes": "Ansiosa con agujas"
}
```

Respuesta `201`: mascota creada con `owner_id` igual al usuario autenticado.

#### `GET /api/patients/my-pets`

Devuelve mascotas del usuario autenticado.

Respuesta:

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Luna", "species": "Perro", "owner_id": 1 }
  ]
}
```

#### `GET /api/patients/all`

Roles: `VET`, `ADMIN`, `CASHIER`.

Devuelve todos los pacientes con datos basicos del propietario.

#### `GET /api/patients/:id`

Devuelve un paciente por id. Si el usuario es cliente, solo puede consultar mascotas propias.

#### `PUT /api/patients/:id`

Actualiza informacion de mascota. El cliente solo puede actualizar mascotas propias.

#### `DELETE /api/patients/:id`

Elimina una mascota. El cliente solo puede eliminar mascotas propias.

### 6.4 Citas

Todas las rutas requieren JWT.

#### `POST /api/appointments`

Roles: `CLIENT`, `ADMIN`.

Body:

```json
{
  "patient_id": 1,
  "vet_id": 5,
  "reason": "Consulta general",
  "date": "2026-06-15",
  "time": "10:00",
  "observations": "No come bien",
  "is_emergency": false
}
```

Reglas:

- Verifica que el paciente pertenezca al cliente autenticado.
- Crea la cita con `status=PENDING`.
- Crea la cita con `payment_status=PENDING`.

Respuesta `201`: cita creada con paciente, cliente y veterinario incluidos.

#### `GET /api/appointments`

Devuelve citas segun rol:

- `CLIENT`: solo sus citas.
- `VET`: solo citas asignadas a ese veterinario.
- `CASHIER`: todas.
- `ADMIN`: todas.

Filtros soportados:

- `status`
- `date_from`
- `date_to`
- `patient_id`

Respuesta:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "reason": "Consulta general",
      "status": "PENDING",
      "payment_status": "PENDING",
      "patient": { "id": 1, "name": "Luna" },
      "client": { "id": 1, "first_name": "Maria" },
      "vet": { "id": 5, "first_name": "Dra. Laura" }
    }
  ]
}
```

#### `GET /api/appointments/:id`

Devuelve una cita por id con asociaciones:

- `patient`
- `client`
- `vet`

#### `PUT /api/appointments/:id`

Actualiza cita.

Body posible:

```json
{
  "date": "2026-06-16",
  "time": "11:30",
  "status": "CONFIRMED",
  "vet_id": 5
}
```

Si el usuario es cliente, solo puede modificar citas propias.

#### `PUT /api/appointments/:id/clinical-notes`

Roles: `VET`, `ADMIN`.

Body:

```json
{
  "clinical_notes": "Paciente alerta, temperatura normal.",
  "diagnosis": "Dermatitis leve",
  "treatment": "Shampoo medicado y control en 15 dias",
  "follow_up_date": "2026-07-01",
  "status": "COMPLETED"
}
```

Reglas:

- Veterinario normal: solo puede agregar notas si esta asignado a la cita.
- Admin: puede guardar notas al simular el rol veterinario.

Respuesta: cita actualizada.

#### `POST /api/appointments/:id/payment`

Roles: `CASHIER`, `ADMIN`.

Body:

```json
{
  "approved": true,
  "amount": 85000,
  "cardholder_name": "Maria Gomez",
  "card_number": "4000 1234 5678 9010"
}
```

Si `approved=true`:

- `payment_status=APPROVED`
- `payment_amount=amount`
- genera `payment_reference`
- `status=CONFIRMED`

Si `approved=false`:

- `payment_status=REJECTED`
- `status=CANCELLED`

#### `PUT /api/appointments/:id/cancel`

Cancela una cita.

Reglas:

- Cliente solo puede cancelar citas propias.
- Otros roles autorizados por autenticacion pueden cancelar segun la logica del servicio.

Respuesta: cita con `status=CANCELLED`.

### 6.5 Contacto

#### `POST /api/contact`

Publico.

Body:

```json
{
  "name": "Juan Perez",
  "email": "juan@email.com",
  "phone": "3010000000",
  "pet_type": "Perro",
  "reason": "Consulta general",
  "preferred_date": "2026-06-15",
  "preferred_time": "10:00",
  "message": "Mi mascota necesita revision"
}
```

Respuesta `201`: mensaje creado.

#### `GET /api/contact`

Roles: `ADMIN`, `CASHIER`.

Devuelve todos los mensajes ordenados por fecha de creacion descendente.

#### `PUT /api/contact/:id/read`

Roles: `ADMIN`, `CASHIER`.

Marca un mensaje como leido (`is_read=true`).

## 7. Flujos completos

### 7.1 Usuario publico solicita cita

1. Entra a `/`.
2. Revisa servicios.
3. Baja a `#agendar`.
4. Llena `ContactForm`.
5. Frontend envia `POST /api/contact`.
6. Backend guarda en `contact_messages`.
7. Admin/cajero puede ver la solicitud desde endpoints de contacto.

### 7.2 Cliente registra mascota y agenda cita

1. Cliente inicia sesion.
2. Va a `/dashboard/client`.
3. Registra mascota con `POST /api/patients`.
4. Agenda cita con `POST /api/appointments`.
5. Backend valida propiedad de la mascota.
6. Cita queda pendiente de pago y confirmacion.

### 7.3 Cajero cobra y confirma

1. Cajero entra a `/dashboard/cashier`.
2. Ve citas con `payment_status=PENDING`.
3. Abre pasarela simulada.
4. Frontend envia `approved=true` a `POST /api/appointments/:id/payment`.
5. Backend aprueba pago, genera referencia y confirma cita.

### 7.4 Veterinario atiende cita

1. Veterinario entra a `/dashboard/vet`.
2. Selecciona cita no completada.
3. Llena historia clinica.
4. Frontend envia `PUT /api/appointments/:id/clinical-notes`.
5. Backend guarda notas, diagnostico, tratamiento y marca cita como completada.

### 7.5 Admin simula roles

1. Admin inicia sesion y entra a `/dashboard`.
2. Selecciona `Simular Cliente`, `Simular Veterinario` o `Simular Cajero`.
3. React navega a la ruta protegida correspondiente.
4. `Dashboard.jsx` detecta que el usuario es `ADMIN` y renderiza el panel simulado.
5. El admin puede volver al selector desde el enlace superior.

## 8. Variables de entorno

### 8.1 Backend

Crear `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=veterycindy
DB_USER=root
DB_PASSWORD=root12345
JWT_SECRET=veterycindy_jwt_secret_key_2024_super_secure
JWT_EXPIRES_IN=24h
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 8.2 Frontend

Crear `frontend/.env` si la API no corre en el valor por defecto:

```env
VITE_API_URL=http://localhost:4000/api
```

## 9. Instalacion local

### 9.1 Requisitos

- Node.js 18 o superior.
- MySQL Server.
- npm.

### 9.2 Backend

```bash
cd backend
npm install
node src/create-db.js
npm run seed
npm run dev
```

La API queda en:

```text
http://localhost:4000
```

Swagger queda en:

```text
http://localhost:4000/api-docs
```

### 9.3 Frontend

```bash
cd frontend
npm install
npm run dev
```

La web queda en:

```text
http://localhost:5173
```

## 10. Seed y usuarios demo

`backend/src/seeders/seed.js` hace:

- Conexion a MySQL.
- `sequelize.sync({ force: true })`, recreando tablas.
- Inserta usuarios demo.
- Inserta mascotas demo.
- Inserta citas demo.
- Inserta mensajes de contacto demo.

Clave para todos:

```text
Password123!
```

Usuarios:

- Cliente: `maria@email.com`
- Cliente: `andres@email.com`
- Cliente: `valentina@email.com`
- Cliente: `carlos@email.com`
- Veterinaria: `dra.laura@veterycindy.com`
- Veterinario: `dr.santiago@veterycindy.com`
- Cajera: `juliana@veterycindy.com`
- Admin: `admin@veterycindy.com`

## 11. Pruebas

### 11.1 Backend

```bash
cd backend
npm test
```

Las pruebas personalizadas levantan el servidor en `4001` y validan:

- `GET /api/health`
- login con credenciales invalidas
- login con credenciales validas
- envio de formulario de contacto

Estas pruebas requieren que MySQL y los datos demo existan.

### 11.2 Frontend

```bash
cd frontend
npm run build
```

Valida que la aplicacion compile para produccion.

Escenarios manuales recomendados:

- Login admin redirige a `/dashboard`.
- Admin puede entrar a simulacion cliente/veterinario/cajero.
- Desde dashboard, `Servicios` y `Contacto` vuelven a la landing y hacen scroll.
- `Mi Panel` permite volver al dashboard despues de visitar la landing.
- Login tiene `Volver al inicio`.
- Botones de registrar mascota, agendar cita, iniciar atencion y recibir pago hacen scroll al formulario correcto.
- Pago aprobado confirma la cita y cambia estado de pago.

## 12. Build y despliegue

### 12.1 Backend en produccion

Pasos generales:

1. Provisionar MySQL.
2. Configurar variables de entorno reales.
3. Instalar dependencias en `backend/`.
4. Crear base de datos.
5. Ejecutar migracion/sync controlada. Actualmente el proyecto usa `sequelize.sync({ alter: true })`.
6. Iniciar con:

```bash
npm start
```

Recomendaciones:

- Usar un proceso manager como PM2 o el gestor del proveedor.
- Configurar `JWT_SECRET` fuerte.
- No usar `seed` en produccion real porque recrea tablas con `force: true`.
- Configurar HTTPS y CORS con el dominio real del frontend.

### 12.2 Frontend en produccion

Pasos generales:

1. Configurar `VITE_API_URL` con la URL publica del backend.
2. Ejecutar:

```bash
cd frontend
npm run build
```

3. Publicar `frontend/dist/` en un hosting estatico.

Como es una SPA con React Router, el servidor de archivos debe redirigir rutas desconocidas a `index.html`.

## 13. Notas importantes de mantenimiento

- El frontend normaliza asociaciones de citas porque Sequelize devuelve alias en minuscula (`patient`, `client`, `vet`) y algunos componentes usan nombres en mayuscula (`Patient`, `Client`, `Vet`) para compatibilidad visual.
- El rol admin puede renderizar paneles simulados sin cambiar el token ni cerrar sesion.
- El navbar mantiene la sesion activa mientras permite volver a la landing publica.
- Los formularios de dashboard usan scroll directo con refs para evitar que el usuario tenga que subir manualmente.
- El flujo de pago es simulado; no hay integracion con una pasarela real.
- La seccion publica `#costos` muestra tarifas de referencia. El panel de caja sigue calculando y confirmando el valor final segun el motivo de la cita.

## 14. Como estudiar este proyecto si estas empezando

Una buena forma de aprender este codigo es seguir un flujo completo de principio a fin. No intentes entender todos los archivos al mismo tiempo; empieza por una accion concreta.

### 14.1 Ejemplo: entender el login

Sigue este camino:

```text
Login.jsx
-> AuthContext.jsx
-> endpoints.js
-> api.js
-> auth.routes.js
-> AuthController.js
-> AuthService.js
-> User.js
-> base de datos users
```

Que ocurre en cada paso:

- `Login.jsx`: captura correo y contrasena desde el formulario.
- `AuthContext.jsx`: expone la funcion `login` para que cualquier componente pueda iniciar sesion.
- `endpoints.js`: define que login es un `POST /auth/login`.
- `api.js`: agrega la URL base y configura Axios.
- `auth.routes.js`: recibe la URL `/api/auth/login`.
- `AuthController.js`: toma `req.body` y llama al servicio.
- `AuthService.js`: busca el usuario, compara la contrasena y genera JWT.
- `User.js`: define como se ve la tabla `users`.
- MySQL: guarda realmente los datos.

Este patron se repite en casi todo el proyecto: la pantalla llama un servicio frontend, el servicio frontend llama una ruta backend, la ruta llama un controller, el controller llama un service y el service usa modelos para hablar con la base de datos.

### 14.2 Ejemplo: entender el pago

El flujo de pago ayuda a entender interaccion entre UI, confirmacion visual y backend:

```text
CashierDashboard.jsx
-> SweetAlert2 confirma
-> appointmentService.processPayment
-> POST /api/appointments/:id/payment
-> AppointmentController.processPayment
-> AppointmentService.processPayment
-> Appointment.update(...)
-> MySQL
```

Conceptos que se practican aqui:

- Estado del formulario con `useState`.
- Referencia al formulario con `useRef`.
- Confirmacion visual con SweetAlert2.
- Peticion HTTP con Axios.
- Autorizacion por rol `CASHIER` o `ADMIN`.
- Actualizacion de una fila en la tabla `appointments`.

### 14.3 Como leer un componente React

Cuando abras un componente, leelo en este orden:

1. Imports: indican que librerias y servicios usa.
2. Estados: muestran que datos cambian en pantalla.
3. Funciones internas: explican que pasa cuando el usuario hace clic o envia un formulario.
4. `useEffect`: muestra que se carga automaticamente.
5. `return`: es el HTML/JSX que se pinta.

Ejemplo en `CashierDashboard.jsx`:

- Los imports muestran React, SweetAlert2, servicios y autenticacion.
- `appointments` guarda citas.
- `payingAppt` guarda la cita que se esta cobrando.
- `handleOpenPayment` abre el formulario.
- `handlePaymentSubmit` confirma y procesa pago.
- El `return` pinta tarjetas, formulario y botones.

### 14.4 Como leer un endpoint backend

Cuando quieras entender un endpoint, busca primero la ruta. Por ejemplo:

```text
backend/src/routes/appointment.routes.js
```

Alli veras algo como:

```js
router.post('/:id/payment', authorize(ROLES.CASHIER, ROLES.ADMIN), appointmentController.processPayment.bind(appointmentController));
```

Eso significa:

- Es un `POST`.
- La URL tiene un parametro `id`.
- Solo entran usuarios `CASHIER` o `ADMIN`.
- La funcion que responde esta en `AppointmentController`.

Luego revisa el controller y despues el service. El service normalmente tiene la logica mas importante.

### 14.5 Diferencia entre datos temporales y datos persistentes

Datos temporales son los que viven solo en el navegador mientras la pagina esta abierta. Ejemplo:

- Lo que escribes en un formulario antes de enviarlo.
- Si un modal esta abierto o cerrado.
- Si una peticion esta cargando.

Datos persistentes son los que quedan guardados en la base de datos. Ejemplo:

- Un usuario registrado.
- Una mascota creada.
- Una cita agendada.
- Un pago aprobado.

React maneja muchos datos temporales con `useState`. MySQL maneja datos persistentes mediante Sequelize.

### 14.6 Por que se usan variables de entorno

Las variables de entorno permiten cambiar configuraciones sin editar codigo. Esto es importante porque desarrollo y produccion suelen tener valores diferentes.

Ejemplos:

- En desarrollo la API puede estar en `http://localhost:4000`.
- En produccion la API puede estar en `https://api.veterycindy.com`.
- La clave `JWT_SECRET` no debe quedar escrita directamente en el codigo.

Por eso el backend usa `.env` y el frontend puede usar `VITE_API_URL`.

### 14.7 Errores comunes al comenzar

- Olvidar iniciar MySQL antes del backend.
- No ejecutar `node src/create-db.js` antes del seed.
- Ejecutar `npm run dev` en la carpeta incorrecta.
- No configurar `VITE_API_URL` si el backend corre en otra URL.
- Cambiar un modelo Sequelize y olvidar revisar como afecta las respuestas del frontend.
- Pensar que `localStorage` es la base de datos. No lo es; solo guarda datos en el navegador.

### 14.8 Mini glosario

- Componente: pieza de interfaz en React.
- Prop: dato que un componente recibe desde otro.
- Estado: dato interno que puede cambiar y volver a pintar la UI.
- Endpoint: URL del backend que recibe una accion.
- Middleware: funcion que se ejecuta antes del controller, por ejemplo para autenticar.
- Controller: capa que recibe peticiones y responde.
- Service: capa donde vive la logica de negocio.
- Model: definicion en codigo de una tabla de base de datos.
- ORM: herramienta para trabajar con la base de datos usando objetos de JavaScript.
- JWT: token firmado para identificar usuarios autenticados.
- CORS: configuracion que permite al frontend llamar al backend desde otro origen.
- Seed: script que llena la base de datos con datos de prueba.
