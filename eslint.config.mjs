// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/comma-dangle': ['error', 'never'],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'vue/multi-word-component-names': 'off'
    }
  }
);
