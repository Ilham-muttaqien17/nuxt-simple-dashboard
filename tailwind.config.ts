import type { Config } from 'tailwindcss';
import { getColors } from 'theme-colors';

export default <Partial<Config>>{
  content: ['components/**/*.vue', 'composables/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue', 'app.vue'],
  theme: {
    extend: {
      colors: {
        // Extend color
        success: {
          ...getColors('#76CA66'),
          DEFAULT: '#76CA66'
        },
        warning: {
          ...getColors('#FFBF35'),
          DEFAULT: '#FFBF35'
        },
        danger: {
          ...getColors('#BA0000'),
          DEFAULTS: '#BA0000'
        }
      }
    },
    fontFamily: {
      sans: ['"Poppins"', 'sans-serif']
    }
  }
};
