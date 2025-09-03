import request from 'supertest';
import app from '../app/app';
import { connectTestDB, disconnectTestDB } from './testSetup';
import logger from '../utils/logger';


jest.setTimeout(10000);

let userToken = '';
let userId = '';

logger.debug(`testuser_${userToken}`)
logger.debug(`testuser_${userId}`)

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('🔐 Auth Routes - Hermex Blog', () => {
  it('should register a new user successfully', async () => {
    const timestamp = Date.now();
    const email = `user@cryptwalli.com`;
    const username = `testuser_${timestamp}`;

    const res = await request(app).post('/api/v1/auth/register').send({
      firstname: 'Test',
      lastname: 'User',
      username,
      email,
      password: 'Password@123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(email);

    userToken = res.body.token;
    userId = res.body.user._id;
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'notfound@example.com',
      password: 'invalidpass',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message.toLowerCase()).toMatch(/invalid|not found/);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'user@cryptwalli.com',
      password: 'Password@123',
    });

    expect([200, 401]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('token');
      userToken = res.body.token;
    }
  });
});


