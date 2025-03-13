import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { authRoutes } from '../../routes/auth-routes'
import { AuthController } from '../../controllers/auth-controller'
import { mockAuthService } from '../mocks/services'

vi.mock('../../controllers/auth-controller', () => {
  return {
    AuthController: vi.fn().mockImplementation(() => ({
      register: vi.fn(),
      login: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      getCurrentUser: vi.fn(),
    })),
  }
})

describe('Auth Routes', () => {
  let server: any
  let authController: any

  beforeEach(async () => {
    server = buildTestServer()
    await server.register(authRoutes)

    // Get the mocked controller instance
    authController = (AuthController as any).mock.results[0].value

    // Set up the mock implementations
    authController.register.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockAuthService.register())
    })

    authController.login.mockImplementation(async (req, reply) => {
      return reply.send(mockAuthService.login())
    })

    authController.forgotPassword.mockImplementation(async (req, reply) => {
      return reply.send(mockAuthService.forgotPassword())
    })

    authController.resetPassword.mockImplementation(async (req, reply) => {
      return reply.send(mockAuthService.resetPassword())
    })

    authController.getCurrentUser.mockImplementation(async (req, reply) => {
      return reply.send(mockAuthService.getCurrentUser())
    })
  })

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'STUDENT',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(authController.register).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('user')
      expect(responseBody).toHaveProperty('token')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          // Missing required fields
          email: 'test@example.com',
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /login', () => {
    it('should login a user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(authController.login).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('user')
      expect(responseBody).toHaveProperty('token')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: {
          // Missing password
          email: 'test@example.com',
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /forgot-password', () => {
    it('should send a password reset link', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/forgot-password',
        payload: {
          email: 'test@example.com',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(authController.forgotPassword).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody).toHaveProperty('resetToken')
    })
  })

  describe('POST /reset-password', () => {
    it('should reset a user password', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/reset-password',
        payload: {
          token: 'reset-token',
          password: 'new-password',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(authController.resetPassword).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
    })
  })

  describe('GET /me', () => {
    it('should get the current user', async () => {
      // Mock the JWT verification
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

      const response = await server.inject({
        method: 'GET',
        url: '/me',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(authController.getCurrentUser).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('email')
      expect(responseBody).toHaveProperty('role')
    })

    it('should return 401 if not authenticated', async () => {
      // Mock JWT verification to fail
      server.jwt.verify = vi.fn().mockImplementation(() => {
        throw new Error('Unauthorized')
      })

      const response = await server.inject({
        method: 'GET',
        url: '/me',
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
