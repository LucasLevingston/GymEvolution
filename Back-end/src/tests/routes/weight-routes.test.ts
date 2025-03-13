import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { weightRoutes } from '../../routes/weight-routes'
import { WeightController } from '../../controllers/weight-controller'
import { mockWeightService } from '../mocks/services'

vi.mock('../../controllers/weight-controller', () => {
  return {
    WeightController: vi.fn().mockImplementation(() => ({
      addWeightRecord: vi.fn(),
      getWeightHistory: vi.fn(),
    })),
  }
})

describe('Weight Routes', () => {
  let server: any
  let weightController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

    await server.register(weightRoutes)

    // Get the mocked controller instance
    weightController = (WeightController as any).mock.results[0].value

    // Set up the mock implementations
    weightController.addWeightRecord.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockWeightService.addWeightRecord())
    })

    weightController.getWeightHistory.mockImplementation(async (req, reply) => {
      return reply.send(mockWeightService.getWeightHistory())
    })
  })

  describe('POST /', () => {
    it('should add a weight record', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          weight: '80',
          bf: '15',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(weightController.addWeightRecord).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weight')
      expect(responseBody).toHaveProperty('bf')
      expect(responseBody).toHaveProperty('date')
      expect(responseBody).toHaveProperty('userId')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          // Missing weight
          bf: '15',
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /', () => {
    it('should get weight history', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(weightController.getWeightHistory).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })

    it('should get weight history for a student', async () => {
      // Mock JWT verification for nutritionist
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'nutritionist-id', role: 'NUTRITIONIST' })

      const response = await server.inject({
        method: 'GET',
        url: '/?studentId=student-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(weightController.getWeightHistory).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })
})
