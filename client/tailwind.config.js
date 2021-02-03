module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-blue-mamba': '#151E25',
        'real-dark': '#1F2932',
        'green-cyan': '#2CC597'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
