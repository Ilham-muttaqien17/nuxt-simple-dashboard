// https://nuxt.com/docs/api/configuration/nuxt-config

let reload = 0;

export default defineNuxtConfig({
  colorMode: {
    preference: 'light'
  },
  nitro: {
    hooks: {
      'dev:reload': () => {
        reload++;
        console.info('App is ', reload === 1 ? 'running' : 'reloaded');
      }
    },
    typescript: {
      strict: true,
      tsConfig: {
        compilerOptions: {
          noUnusedParameters: true,
          noUnusedLocals: true,
          verbatimModuleSyntax: true
        }
      }
    },
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  telemetry: false,
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUnusedParameters: true,
        noUnusedLocals: true,
        verbatimModuleSyntax: true
      }
    }
  },
  vite: { clearScreen: false }
});
