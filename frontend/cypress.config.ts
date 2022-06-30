import { defineConfig } from 'cypress'

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/test-[hash].xml',
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'src/**/*spec.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
})
