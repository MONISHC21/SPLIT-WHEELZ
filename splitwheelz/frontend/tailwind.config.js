export default {
  darkMode: ["class"],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', foreground: '#ffffff', 50: '#eff6ff', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },
        accent: { DEFAULT: '#38BDF8', foreground: '#0F172A' },
        navy: { DEFAULT: '#0F172A', 800: '#1e293b', 700: '#334155', 600: '#475569' },
        success: '#22C55E',
        background: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
