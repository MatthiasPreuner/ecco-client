const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: true,
    json: false,
    timestamp:"dd.mm.yyyy_HH:MM" 
  },
  e2e: {
    baseUrl: 'http://localhost:8080',
  },
});
