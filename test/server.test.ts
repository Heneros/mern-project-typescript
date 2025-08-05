import supertest from 'supertest';
import mongoose from 'mongoose';
// import * as emailService from '../backend/utils/sendEmail';\

process.env.NODE_ENV = 'test';

process.env.GOOGLE_CLIENT_ID = 'test-google-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://test-callback';

process.env.GITHUB_CLIENT_ID = 'test-github-id';
process.env.GITHUB_CLIENT_SECRET = 'test-github-secret';
process.env.GITHUB_CALLBACK_URL = 'http://test-github-callback';


import  app  from '@/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

export const request = supertest(app);

beforeAll(async () => {
    await connectTestDB();

    jest.mock('passport', () => ({
        use: jest.fn(),
        initialize: jest.fn(() => (req: any, res: any, next: any) => next()),
        session: jest.fn(() => (req: any, res: any, next: any) => next()),
        authenticate: jest.fn(() => (req: any, res: any, next: any) => next()),
        serializeUser: jest.fn((fn) => fn(null, { id: 'test-user-id' })),
        deserializeUser: jest.fn((fn) => fn(null, { id: 'test-user-id' })),
    }));

    jest.mock('passport-google-oauth20', () => {
        return {
            Strategy: jest.fn().mockImplementation(() => {
                return {
                    name: 'google',
                    authenticate: jest.fn((req, options) => {}),
                };
            }),
        };
    });
   jest.mock('passport-github2', () => ({
    Strategy: jest.fn().mockImplementation(() => ({
      name: 'github',
      authenticate: jest.fn(),
    })),
  }));
    
});

afterAll(async () => {
    await disconnectTestDB();
});

describe('Database Connection', () => {
    it('should have active MongoDB connection', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });
});
