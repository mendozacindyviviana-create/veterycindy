/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vet: {
          green: '#14532D',      // Bosque profundo - confianza y naturaleza
          teal: '#0F766E',       // Verde azulado cálido
          amber: '#B45309',      // Ámbar cálido - calidez y cuidado
          cream: '#FDF8F0',      // Crema suave fondo
          sand: '#F5EDE3',       // Arena suave
          coral: '#9F1239',      // Rojo suave para emergencias
        }
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
