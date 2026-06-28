'use strict';

module.exports = {
  spec: 'e2e/selenium/specs/**/*.spec.cjs',
  timeout: 30000,
  slow: 5000,
  reporter: 'mocha-multi-reporters',
  reporterOptions: 'configFile=e2e/selenium/mocha-multi-reporters.json',
};
