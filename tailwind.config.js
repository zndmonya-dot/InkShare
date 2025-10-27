/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material Design M3 color scheme
        primary: '#6750A4',
        'primary-container': '#EADDFF',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#21005D',
        secondary: '#625B71',
        'secondary-container': '#E8DEF8',
        'on-secondary': '#FFFFFF',
        'on-secondary-container': '#1D192B',
        surface: '#FFFBFE',
        'surface-variant': '#E7E0EC',
        'on-surface': '#1C1B1F',
        'on-surface-variant': '#49454F',
        outline: '#79747E',
      },
    },
  },
  plugins: [],
}

