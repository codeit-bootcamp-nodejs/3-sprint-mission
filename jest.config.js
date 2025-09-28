const config = {
  coverageProvider: "v8",
  
  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  
  // The test environment that will be used for testing
  testEnvironment: "node",
  
  // Global setup and teardown
  globalSetup: '<rootDir>/test/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/test/setup/globalTeardown.ts',
  
  // 테스트를 순차적으로 실행 (병렬 실행 방지)
  maxWorkers: 1,
  
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      configFile: './babel.config.js'
    }],
  },
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/test/**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  
  // Module name mapping (for absolute imports)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'test/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!test/**/*.d.ts',
    '!src/app.ts',
    '!**/node_modules/**',
  ],
};

module.exports = config;
