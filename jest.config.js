// For a detailed explanation regarding each configuration property, visit: https://jestjs.io/docs/en/configuration.html
const { paths } = require('./utils')

module.exports = {
  rootDir: paths.app('/'),
  clearMocks: true, // Automatically clear mock calls and instances between every test
  coverageDirectory: 'coverage', // The directory where Jest should output its coverage files
  coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/dist/'], // An array of regexp pattern strings used to skip coverage collection
  coverageReporters: ['text', 'lcov'], // A list of reporter names that Jest uses when writing coverage reports
  testEnvironment: 'jsdom', // The test environment that will be used for testing
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'], // The glob patterns Jest uses to detect test files
  transform: { '.(ts|tsx|js|jsx|mjs)': paths.cli('jest.preprocessor.js') }, // A map from regular expressions to paths to transformers
  transformIgnorePatterns: ['node_modules/(?!(@xhtm/store)/)'],
  coverageThreshold: { global: { branches: 65, functions: 80, lines: 85, statements: 80 } },
}
