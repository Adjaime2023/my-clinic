/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // se você usar estrutura app/
    './pages/**/*.{js,ts,jsx,tsx}',    // se você usar estrutura pages/
    './components/**/*.{js,ts,jsx,tsx}' // componentes reutilizáveis
  ],
  darkMode: 'class', // ou 'media' para detectar preferências do sistema
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // azul personalizado
        accent: '#F59E0B',  // laranja personalizado
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // fonte moderna
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),     // estilos para inputs
    require('@tailwindcss/typography') // melhor formatação de textos
  ],
}
