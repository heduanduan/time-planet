/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          gold: '#FFDF00',
          pink: '#F472B6',
          dark: '#0A0B1E',
          deep: '#121330',
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to bottom, #0A0B1E, #121330)',
      },
    },
  },
  plugins: [],
}
