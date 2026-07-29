/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          100: '#FBEAD0',
          300: '#F1C179',
          500: '#E8A23D',
          600: '#C98429',
          700: '#A66A1E',
          900: '#5F3A0F',
        },
        teal: {
          100: '#D8EEF0',
          300: '#7EC1C7',
          500: '#1F6F78',
          600: '#195A61',
          700: '#14454A',
          900: '#0A2528',
        },
        ink: {
          50: '#F5F6F8',
          100: '#DDE1EA',
          300: '#8D97AC',
          500: '#3D4A66',
          700: '#16233F',
          900: '#0B111F',
        },
        moss: {
          100: '#DCEEE4',
          300: '#8FC2AA',
          500: '#3F7D5C',
          600: '#336549',
          700: '#294F3A',
          900: '#142719',
        },
        coral: {
          100: '#FADFDA',
          300: '#EC9C8C',
          500: '#D8543F',
          600: '#B33F2C',
          700: '#8C3122',
          900: '#4A1A12',
        },
        canvas: {
          DEFAULT: '#F5F6F2',
          surface: '#FFFFFF',
          border: '#E7E9E4'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['34px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-lg': ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body-lg': ['16px', { lineHeight: '1.65' }],
        'body-md': ['14px', { lineHeight: '1.55' }],
        'body-sm': ['13px', { lineHeight: '1.45', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(22,35,63,0.04)',
        'sm': '0 2px 6px rgba(22,35,63,0.06)',
        'md': '0 6px 16px rgba(22,35,63,0.10)',
        'lg': '0 12px 32px rgba(22,35,63,0.16)',
      },
      keyframes: {
        'pulse-node': { 
          '0%,100%': { transform: 'scale(1)', opacity: '1' }, 
          '50%': { transform: 'scale(1.08)', opacity: '0.85' } 
        },
      },
      animation: { 
        'pulse-node': 'pulse-node 2s ease-in-out infinite' 
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
