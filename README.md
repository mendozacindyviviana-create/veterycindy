# 🐾 VeteryCindy - Landing Page

Landing page profesional y atractiva para **VeteryCindy**, una clínica veterinaria ubicada en **Bogotá, Colombia**.

La página permite a los dueños de mascotas agendar citas de forma sencilla mediante un formulario que genera un correo electrónico prellenado dirigido a la clínica.

![VeteryCindy](https://picsum.photos/id/1012/1200/400)

## ✨ Características

- **Diseño premium y cálido** con paleta de colores verde bosque + ámbar + crema
- **Hero impactante** con mensaje emocional y estadísticas de confianza
- **Servicios destacados** (Consulta, Vacunación, Emergencias 24/7, Cirugía, Esterilización, etc.)
- **Galería de pacientes** con fotos de mascotas urbanas
- **Formulario de agendamiento completo**:
  - Motivo de la cita (12 opciones)
  - **Tipo de mascota** (solo mascotas de ciudad): Perro, Gato, Ave, Conejo, Hámster, Tortuga, Peces, Reptil, Otro
  - Fecha (solo lunes a sábado)
  - Hora dinámica (L-V 9:00-17:00 / Sáb 9:00-15:00)
  - **Emergencias**: el campo de hora se oculta automáticamente
  - Datos de contacto (nombre, celular, correo)
  - Observaciones adicionales
- **Selección visual de horarios** con pills modernos y centrados
- **Resumen en vivo** de la cita mientras se llena el formulario
- **Envío por correo** usando `mailto:` (sin backend)
- Totalmente **responsive** (móvil, tablet y desktop)
- Código mantenido simple y legible (estilo desarrollador junior)

## 🛠️ Tecnologías utilizadas

- **React 19** + **Vite**
- **Tailwind CSS v4**
- JavaScript vanilla (sin frameworks adicionales)
- Diseño 100% en español con enfoque en Bogotá

## 🚀 Instalación y ejecución local

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd veterycindy
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 📦 Scripts disponibles

| Comando          | Descripción                          |
|------------------|--------------------------------------|
| `npm run dev`    | Inicia servidor de desarrollo        |
| `npm run build`  | Genera build de producción           |
| `npm run lint`   | Ejecuta ESLint                       |
| `npm run preview`| Previsualiza el build de producción  |

## 📁 Estructura del proyecto

```
veterycindy/
├── public/
├── src/
│   ├── App.jsx          ← Todo el sitio (componente principal)
│   └── index.css        ← Estilos y utilidades Tailwind
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

> **Nota**: Por diseño, toda la landing está concentrada en `App.jsx` para mantener el código simple y fácil de mantener (siguiendo el estilo de un desarrollador junior).

## ⚙️ Personalización

Puedes modificar fácilmente los siguientes elementos:

- **Correo de destino** → `src/App.jsx` (línea del `mailto:`)
- **Teléfono** → Cambia `+57 301 000 3030` en todo el archivo
- **Dirección** → Actualmente configurada como Bogotá
- **Lista de mascotas** → Edita el array `tiposMascota`
- **Motivos de cita** → Edita el array `motivos`
- **Horarios** → Función `generarHorarios()`
- **Colores** → `tailwind.config.js` (sección `vet.*`)

## 📬 Cómo funciona el formulario

El formulario **no usa backend**. Al hacer clic en "Enviar solicitud por correo":

1. Se construye un correo bien formateado con todos los datos.
2. Se abre el cliente de correo del usuario (`mailto:`).
3. El usuario solo debe presionar "Enviar".

Esto es ideal para clínicas pequeñas que aún no tienen sistema de reservas en línea.

## 🖼️ Capturas de pantalla

> Recomendado: agrega capturas reales de la página en desktop y móvil aquí.

- Hero con estadísticas
- Formulario de agendamiento con selección de mascota y horarios
- Vista móvil responsiva

## 📄 Licencia

Este proyecto es de uso libre para fines educativos o comerciales de la clínica VeteryCindy.

---

**Hecho con ❤️ para las mascotas de Bogotá**

¿Quieres que agregue sección de "Cómo contribuir", más detalles técnicos o un changelog? Dímelo y lo ajusto.
