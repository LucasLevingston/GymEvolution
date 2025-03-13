import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { trainingWeekRoutes } from '../../routes/training-week-routes'
import { TrainingWeekController } from '../../controllers/training-week-controller'
import { mockTrainingWeekService } from '../mocks/services'

vi.mock('../../controllers/training-week-controller', () => {
  return {
    TrainingWeekController: vi.fn().mockImplementation(() => ({
      createTrainingWeek: vi.fn(),
      getAllTrainingWeeks: vi.fn(),
      getTrainingWeekById: vi.fn(),
      updateTrainingWeek: vi.fn(),
      deleteTrainingWeek: vi.fn(),
    })),
  }
})

describe('Training Week Routes', () => {
  let server: any
  let trainingWeekController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

    await server.register(trainingWeekRoutes)

    // Get the mocked controller instance
    trainingWeekController = (TrainingWeekController as any).mock.results[0]
      .value

    // Set up the mock implementations
    trainingWeekController.createTrainingWeek.mockImplementation(
      async (req, reply) => {
        return reply
          .status(201)
          .send(mockTrainingWeekService.createTrainingWeek())
      }
    )

    trainingWeekController.getAllTrainingWeeks.mockImplementation(
      async (req, reply) => {
        return reply.send(mockTrainingWeekService.getAllTrainingWeeks())
      }
    )

    trainingWeekController.getTrainingWeekById.mockImplementation(
      async (req, reply) => {
        return reply.send(mockTrainingWeekService.getTrainingWeekById())
      }
    )

    trainingWeekController.updateTrainingWeek.mockImplementation(
      async (req, reply) => {
        return reply.send(mockTrainingWeekService.updateTrainingWeek())
      }
    )

    trainingWeekController.deleteTrainingWeek.mockImplementation(
      async (req, reply) => {
        return reply.send({ message: 'Training week deleted successfully' })
      }
    )
  })

  describe('POST /', () => {
    it('should create a training week', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          weekNumber: 1,
          information: 'Test training week',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(trainingWeekController.createTrainingWeek).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weekNumber')
      expect(responseBody).toHaveProperty('information')
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
          // Missing weekNumber
          information: 'Test training week',
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /', () => {
    it('should get all training weeks', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(trainingWeekController.getAllTrainingWeeks).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })

    it('should get training weeks for a student', async () => {
      // Mock JWT verification for trainer
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' })

      const response = await server.inject({
        method: 'GET',
        url: '/?studentId=student-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(trainingWeekController.getAllTrainingWeeks).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })

  describe('GET /:id', () => {
    it('should get a training week by ID', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/training-week-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(trainingWeekController.getTrainingWeekById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weekNumber')
      expect(responseBody).toHaveProperty('information')
      expect(responseBody).toHaveProperty('userId')
      expect(responseBody).toHaveProperty('trainingDays')
      expect(responseBody).toHaveProperty('user')
    })
  })

  describe('PUT /:id', () => {
    it('should update a training week', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/training-week-id',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          weekNumber: 2,
          information: 'Updated training week',
          current: true,
        },
      })

      expect(response.statusCode).toBe(200)
      expect(trainingWeekController.updateTrainingWeek).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weekNumber')
      expect(responseBody).toHaveProperty('information')
    })
  })

  describe('DELETE /:id', () => {
    it('should delete a training week', async () => {
      // Mock JWT verification for trainer
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' })

      const response = await server.inject({
        method: 'DELETE',
        url: '/training-week-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(trainingWeekController.deleteTrainingWeek).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody.message).toBe('Training week deleted successfully')
    })
  })
})
