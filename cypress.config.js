const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1000,
  viewportHeight: 1000,
  fixturesFolder: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'test-results/cypress/junit-[hash].xml'
  },
  retries: {
    runMode: 3
  },
  e2e: {
    setupNodeEvents(on, config) {},
    experimentalSessionAndOrigin: true,
    baseUrl: 'https://next-js-auth0-front-g4up1vkwi-deepaksen2008s-projects.vercel.app'
  }
});
