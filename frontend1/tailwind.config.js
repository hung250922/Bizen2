/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  corePlugins: {
    // Chakra owns the global reset. Tailwind is used for utility/layout classes.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        bizen: {
          primary: '#49a7a2',
          primaryDark: '#318d89',
          primarySoft: '#e8f6f5',
          bg: '#f5f8f8',
          card: '#ffffff',
          border: '#dfeceb',
          text: '#24363d',
          muted: '#71848a',
          accent: '#f08a62',
          ink: '#17323a',
          surface: '#f0f7f6',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        bizen: '0 8px 28px rgba(41, 91, 95, .07)',
        'bizen-lifted': '0 18px 45px rgba(31, 72, 77, .10)',
      },
    },
  },
  plugins: [],
};
