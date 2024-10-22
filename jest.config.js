module.exports = {
  // A list of file extensions that Jest should look for
  testMatch: ['**/*.test.js'],

  // Enable code coverage reporting
  collectCoverage: true,

  // Set the directory for coverage reports
  coverageDirectory: '<rootDir>/coverage',

  // Specify the files to include for coverage
  collectCoverageFrom: ['<rootDir>/apps/**/*.js', '<rootDir>/packages/**/*.js'],

  // Which file patterns to ignore in coverage
  coveragePathIgnorePatterns: [
    '<rootDir>/apps/inventory/db',
    '<rootDir>/apps/order/db',
    '<rootDir>/apps/inventory/routes',
    '<rootDir>/apps/order/routes',
    'index.js',
    'app.js',
    'server.js',
  ],
};
