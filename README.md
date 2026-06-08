# 🐾 VeteryCindy - Plataforma de Clínica Veterinaria

Una plataforma full-stack para la veterinaria **clínica VeteryCindy** en **Bogotá, Colombia**.

Este sistema maneja una **arquitectura monorepo** que presenta un frontend React.JS con Vite y Tailwind para el diseño y estilo de la aplicacion. La interfaz web se divide a partir de componentes (abrir frontend/src/components) y aqui manejo 4 divisiones de componentes autenticacion, dashboard o pagina del inicio de sesion y el inicio principal. La carpeta common contiene todos los campos extra que uso en cada parte de la pagina.
La interfaz esta creada con un diseño adaptable a cualquier tipo de pantalla, usa React Context (mostrar carpeta frontend/src/context) para gestión de sesiones y principios SOLID estándar para una arquitectura mas limpia y simplificada en el proyecto.


En el backend una API REST de Node.js/Express.js  (abrir backend/src/app.js) impulsada por Sequelize (MySQL) (abrir dos archivos de la carpeta backend/models) donde mapeo los campos de las tablas indicando los nombres de las tablas, nombre de campos y sus tipos de datos para hacer uso del ORM en las consultas. Una autenticación de los usuarios usando JWT (abrir backend/middleware/auth.js) que se crea al momento de iniciar sesion en la plataforma donde controlo los accesos basado en roles (Donde se manejan 3 roles en especifico [Clientes, Veterinarios, Cajeros]). Adicional maneja un diseño de carpetas que emplea el patrón MVC (Modelo, Vista, Controlador), middlewares y capas de validación y manejadores de errores personalizados.

![VeteryCindy Banner](https://picsum.photos/id/1012/1200/400)

```
veterycindy/
├── backend/                  ← Contiene toda la API REST de Express & Modelos de Base de Datos
│   ├── src/
│   │   ├── config/           ← Aqui manejamos la Configuración de base de datos y constantes
│   │   ├── controllers/      ← Aqui tenemos los Manejadores de enrutamiento de Request/Response
│   │   ├── docs/             ← Aqui creamos la documentacion de Definiciones de la API con Swagger
│   │   ├── middleware/       ← Aqui controlamos todos el tema de Autenticación JWT y manejador de errores
│   │   ├── models/           ← En esta carpeta esta todos los Esquemas de la base de datos y usamos Sequelize para sun manejo como orm de (Usuario, Paciente, Cita, Mensaje de Contacto)
│   │   ├── routes/           ← En esta carpeta definimos todos los Endpoints de API
│   │   └── seeders/          ← En esta seccion para pruebas manejamos los datos de demostración
│   └── tests/                ← En esta carpeta creamos los test de pruebas de integración con jest
│
└── frontend/                 ← Aqui tenemos toda la interfaz del Cliente
    ├── src/
    │   ├── components/       ← Dentro de los componentes tenemos 4
    │   │   ├── auth/         ← aqui tenemos Componentes de inicio de sesión y registro
    │   │   ├── common/       ← Aqui ya estan los componentes Componentes globales que se usan en todas las paginas (Navbar, Footer, ProtectedRoute)
    │   │   ├── dashboard/    ← Este es el inicio cuando los Clientes, los Veterinarios y los Cajeros inician sesion.
    │   │   └── landing/      ← Aqui tenemos toda la pagina de inicio con Secciones modulares de la página (Inicio, Servicios, Formualrio de contacto, etc.)
    │   ├── context/          ← En esta carpeta manejamos el Proveedor de AuthContext global
    │   ├── pages/            ← Aqui tenemos las Vistas de página de nivel superior (Inicio, Iniciar Sesión, Registro, Panel)
    │   └── services/         ← Aqui controlamos con  Axios la conexion a la api del backend para  configurar los endpoints
```
---

## 🚀 Como se instala y configura

### 1. Que necesitamos
- **Node.js** (v18+) Y
- **Servidor MySQL** (Ejecutándose en el puerto 3306)

---
Para la siguiente explicacion vamos a abrir la consola (Abrirla con el comando Ctrl + ñ)
### 2. Configuración del Backend
- Debemos Ingresar a la carpeta backend desde la terminal con
   ```bash
    cd backend
    ```
y hacer el comando :
    ```bash
    npm install
    ```
para instalar las dependencias del proyecto
- ahora Configuramos el archivo `.env` y lo actualizamos con credenciales validas, para mi ejemplo yo uso (abrir archivo backend/.env):
    ```env
    // Base de datos
    DB_HOST=localhost
    DB_PORT=3306
    DB_NAME=veterycindy
    DB_USER=root
    DB_PASSWORD=root12345

    // Llave del jwt para seguridad en la sesion
    JWT_SECRET=veterycindy_jwt_secret_key_2024_super_secure

    // puerto donde corre la api
    PORT=4000
    ```
-- Creamos la Base de Datos e Insertamos Datos de Demostración ejecunado el siguiente comando:
    ```bash
    // este comando para Crear base de datos
    node src/create-db.js
    
    # Con este comando Sincroniza tablas e inserta datos mock ricos
    npm run seed
    ```
- Ejecutamos el ultimo comando para inciar el servicio del backend o la api
    ```bash
    npm run dev
    ```

---

### Vamos a configurar el Frontend
1. Ingresamos desde la terminal a la carpeta frontend:
    ```bash
    cd ../frontend
    ```
2. Despues Instalamos las dependencias:
    ```bash
    npm install
    ```
3. Por ultimo ejecutamos el servidor Vite:
    ```bash
    npm run dev
    ```
4. Y Abrimos el navegador en `http://localhost:5173`.

---

## 🧪 Pruebas de Integración

Por pruebas de la aplicacion y funcionalidad Hemos creado un conjunto de pruebas de integración usando jest donde se prueba todos los aspectos de los servicios backend sin depender de cargadores legados.

Para ejecutar el conjunto de pruebas backend:
```bash
cd backend
npm test
```

### ¿Qué se verifica:
1. **Salud de la API**: Asegura que `/api/health` responda correctamente.
2. **Control de Acceso**: Valida el rechazo de autenticación en entradas de inicio de sesión incorrectas.
3. **Emisión de Sesiones**: Valida la generación de tokens y la representación del esquema de usuario en caso de éxito.
4. **Integración de Formularios**: Envía una consulta de contacto para verificar la persistencia directa.

---

## 🔑 Inicios de Sesión de Demostración (Contraseña: `Password123!`)

- 👤 **Cliente**: `maria@email.com` / `andres@email.com`
- 🩺 **Veterinario**: `dra.laura@veterycindy.com` / `dr.santiago@veterycindy.com`
- 💰 **Cajero**: `juliana@veterycindy.com`
- 🔑 **Administrador**: `admin@veterycindy.com`

---

## ✨ Características & Portales Basados en Roles

### 🌟 Página de Aterrizaje Pública
- **Estética Impactante**: Tarjetas curvas, micro-animaciones suaves, paletas de colores curadas y vidriomorfismo.
- **Grilla Dinámica de Servicios**: Presentación elegante de tratamientos clínicos.
- **Formulario Interactivo de Contacto & Cita**: Registra automáticamente las solicitudes de clientes en la base de datos backend utilizando Axios.

### 👥 Autenticación & Gestión de Sesiones
- Registro e inicio de sesión seguros para todos los usuarios.
- Contraseñas encriptadas usando `bcryptjs` y sesiones basadas en tokens con **JWT**.
- Persistencia de sesiones de usuario en `localStorage` con redirección automática de interceptor 401.

### 💳 Portal de Cliente (Propietario)
- **Directorio de Mascotas**: Registre, vea y actualice mascotas.
- **Reserva de Citas**: Seleccione una mascota, elija fecha (Lun-Sáb), horas dinámicas y envíe instantáneamente.
- **Historial de Citas**: Rastree visitas pasadas y próximas, cancelaciones e instrucciones clínicas.

### 🩺 Portal de Veterinario
- **Horario Médico**: Vista todas las citas asignadas.
- **Sala de Consulta**: Agregue notas clínicas, descripciones diagnósticas, prescriba tratamientos y programe controles de control.
- **Transiciones Automáticas**: Establezca citas como `COMPLETADO` automáticamente después de diagnosticar.

### 💰 Portal de Cajero (Cajero)
- **Consola de Facturación**: Monitoree todas las citas de la plataforma.
- **Pasarela de Pago Simulada**: Procese pagos usando tarjetas de crédito, autorizando y cambiando el estado a `CONFIRMADO` y `APROBADO`.

---

**Hecho con ❤️ para las mascotas de Bogotá, Colombia**