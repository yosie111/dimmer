const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'niw8q9',
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    env: {
      apiUrl: 'http://localhost:5000'
    }
  }
});
