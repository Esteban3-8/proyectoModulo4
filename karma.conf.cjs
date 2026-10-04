module.exports = config => config.set({
  frameworks: ['jasmine'],
  files: ['tmp/tests/unit.spec.js'],
  reporters: ['progress', 'junit'],
  junitReporter: {
    outputDir: 'reports/junit',
    outputFile: 'unit-tests.xml',
    useBrowserName: false,
  },
  browsers: ['ChromeHeadless'],
  singleRun: true,
  autoWatch: false,
  client: { jasmine: { random: true } },
});
