import { fastify, FastifyInstance } from 'fastify';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { User } from '@prisma/client';
import { userRoutes } from 'routes/user-routes';

// Mock das funções importadas
vi.mock('controllers/user/create', () => ({
  createUserController: vi.fn(),
}));

vi.mock('controllers/user/login', () => ({
  login: vi.fn(),
}));

vi.mock('controllers/user/update', () => ({
  updateUser: vi.fn(),
}));

vi.mock('controllers/user/get', () => ({
  getUser: vi.fn(),
}));

vi.mock('controllers/history/get', () => ({
  getHistoryController: vi.fn(),
}));

const { createUserController } = require('controllers/user/create');
const { login } = require('controllers/user/login');
const { updateUser } = require('controllers/user/update');
const { getUser } = require('controllers/user/get');
const { getHistoryController } = require('controllers/history/get');

describe('User Routes', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = fastify();
    app.register(userRoutes);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user', async () => {
    const user = { email: 'test@example.com', password: 'password' } as User;
    createUserController.mockResolvedValue(user);

    const response = await app.inject({
      method: 'POST',
      url: '/create',
      payload: user,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(user);
  });

  it('should login a user', async () => {
    const responseData = { token: 'some-token' };
    login.mockResolvedValue(responseData);

    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'test@example.com', password: 'password' },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(responseData);
  });

  it('should update a user', async () => {
    const updatedUser = { email: 'test@example.com', password: 'new-password' } as User;
    updateUser.mockResolvedValue(updatedUser);

    const response = await app.inject({
      method: 'PUT',
      url: '/',
      payload: updatedUser,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(updatedUser);
  });

  it('should get a user by email', async () => {
    const user = { email: 'test@example.com', name: 'Test User' };
    getUser.mockResolvedValue(user);

    const response = await app.inject({
      method: 'GET',
      url: '/test@example.com',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(user);
  });

  it('should get user history', async () => {
    const history = [{ action: 'login', date: '2023-01-01' }];
    getHistoryController.mockResolvedValue(history);

    const response = await app.inject({
      method: 'GET',
      url: '/history',
      payload: { email: 'test@example.com' },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(history);
  });
});
