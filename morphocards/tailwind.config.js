module.exports = {
  // mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Plus Jakarta Sans']
    },
    extend: {
    },
  },
  variants: {
    extend: {
      dropShadow: ['hover', 'active'],
      scale: ['hover', 'active'],
      ringWidth: ['hover', 'active'],
      backgroundColor: ['active'],
      borderRadius: ['hover', 'focus'],
      textColor: ['active'],
      padding: ['hover'],
      margin: ['hover'],
      backgroundOpacity: ['active'],
      gap: ['hover', 'focus'],
    },
  },
  plugins: [],
}
