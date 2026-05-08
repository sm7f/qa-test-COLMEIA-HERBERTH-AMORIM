const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  fixturesFolder: "cypress/fixtures",
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || "https://example.invalid",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js"
  }
});

