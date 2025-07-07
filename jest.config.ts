import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    detectOpenHandles: true,
    coverageProvider: 'v8',
    testMatch: ['**/test/**/*.test.ts'],
    testTimeout: 60000,
    setupFiles: ['dotenv/config'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/backend/$1',

    },
    rootDir: '.',
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/ignore/'],
};

export default config;
