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
        '^@/(.*)$': '<rootDir>/$1',
    },
    rootDir: '.',
    testPathIgnorePatterns: ['/node_modules/', '/ignore/'],
};

export default config;
