module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-blue-mamba': '#151E25',
        'real-dark': '#1F2932',
        'green-cyan': '#2CC597',
        'slate-gray': '#75818B',
        'light-red': '#FF718D',
        'light-blue': '#0c87f2',
        yellow: '#fab915'
      },
      screens: {
        '3xl': '1920px'
      },
      spacing: {
        128: '30rem'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: []
};
