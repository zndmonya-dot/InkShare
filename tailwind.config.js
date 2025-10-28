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
        // Splatoon-inspired color scheme
        'ink-yellow': '#F7D308',
        'ink-magenta': '#FF4AAD',
        'ink-cyan': '#00D9FF',
        'ink-green': '#19D719',
        'ink-purple': '#DB00DB',
        'ink-orange': '#FF8C00',
        'ink-blue': '#2E3D65',
        'ink-pink': '#FF69B4',
        'splat-dark': '#1A1A2E',
        'splat-light': '#F5F5F5',
      },
      fontFamily: {
        'splat': ['ui-rounded', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ink-gradient': 'linear-gradient(135deg, #F7D308 0%, #FF4AAD 50%, #00D9FF 100%)',
        'ink-gradient-2': 'linear-gradient(135deg, #19D719 0%, #DB00DB 50%, #FF8C00 100%)',
      },
    },
  },
  plugins: [],
}

