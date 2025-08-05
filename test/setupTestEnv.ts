
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'test-google-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://test-callback';
process.env.GITHUB_CLIENT_ID = 'test-github-id';
process.env.GITHUB_CLIENT_SECRET = 'test-github-secret';
process.env.GITHUB_CALLBACK_URL = 'http://test-github-callback';

jest.mock('@/config/passportSetup', () => {

  return {
    __esModule: true,
    default: () => {}
  };
});
jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn().mockImplementation(() => ({
    name: 'google',
    authenticate: jest.fn()
  }))
}));
jest.mock('passport-github2', () => ({
  Strategy: jest.fn().mockImplementation(() => ({
    name: 'github',
    authenticate: jest.fn()
  }))
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
  }
}));
