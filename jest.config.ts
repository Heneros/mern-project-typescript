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
    testTimeout: 30000,
    setupFiles: ['dotenv/config'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/backend/$1',
        '^server$': '<rootDir>/backend/server.ts',
        '^models/(.*)$': '<rootDir>/backend/models/$1',
    },
    rootDir: '.',
    testPathIgnorePatterns: ['/node_modules/', '/ignore/'],
    // globals: {
    //     'ts-jest': {
    //         tsconfig: '<rootDir>/tsconfig.json',
    //     },
    // },
};

export default config;
