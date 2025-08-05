jest.mock('@/config/passportSetup', () => {
    return {
        __esModule: true,
        default: () => {},
    };
});
jest.mock('passport-google-oauth20', () => ({
    Strategy: jest.fn().mockImplementation(() => ({
        name: 'google',
        authenticate: jest.fn(),
    })),
}));
jest.mock('passport-github2', () => ({
    Strategy: jest.fn().mockImplementation(() => ({
        name: 'github',
        authenticate: jest.fn(),
    })),
}));
jest.mock('passport', () => ({
    __esModule: true,
    default: {
        use: jest.fn(),
        initialize: jest.fn(() => (req, res, next) => next()),
        session: jest.fn(() => (req, res, next) => next()),
        authenticate: jest.fn(() => (req, res, next) => next()),
        serializeUser: jest.fn((fn) => fn(null, { id: 'test-user-id' })),
        deserializeUser: jest.fn((fn) => fn(null, { id: 'test-user-id' })),
    },
}));
