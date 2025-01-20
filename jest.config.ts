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
    setupFiles: ['dotenv/config'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/backend/$1',
    },
};

export default config;
