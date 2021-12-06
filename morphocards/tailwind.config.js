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
    },
  },
  plugins: [],
}
