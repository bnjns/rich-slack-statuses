module.exports = {
  preset: 'ts-jest',
  roots: [
    'tests'
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.spec.ts'
  ],
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  transform: {
    '\\.ts$': ['ts-jest', {
      tsConfig: '<rootDir>/tsconfig.tests.json'
    }]
  },
  reporters: [
    'default', [
      'jest-junit', {
        suiteName: 'Unit',
        outputDirectory: 'reports',
        outputName: 'tests.xml',
        uniqueOutputName: 'false'
      }
    ]
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  testResultsProcessor: 'jest-sonar-reporter'
}
