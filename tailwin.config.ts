import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: ['components/**/*.vue', 'composables/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue', 'app.vue'],
  theme: {
    extend: {
      colors: {
        // Extend color
      }
    }
  }
};
