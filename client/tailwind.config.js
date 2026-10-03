/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A', // Primary Brand Green
          700: '#15803D', // Darker Green
          800: '#166534',
          900: '#14532D',
          dark: '#0B291A'
        },
        surface: {
          light: '#F4FBF6',
          card: '#FFFFFF',
          muted: '#F7FCF8',
          border: '#E2EFE7'
        },
        charcoal: {
          500: '#6B7280',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
