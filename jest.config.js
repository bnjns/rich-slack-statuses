module.exports = {
  preset: 'ts-jest',
  roots: [
    'tests'
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.spec.ts'
  ],
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
  coverageDirectory: 'coverage'
}