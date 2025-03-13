import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { exerciseRoutes } from '../../routes/exercise-routes'
import { ExerciseController } from '../../controllers/exercise-controller'
import { mockExerciseService } from '../mocks/services'

vi.mock('../../controllers/exercise-controller', () => {
  return {
    ExerciseController: vi.fn().mockImplementation(() => ({
      createExercise: vi.fn(),
      getExerciseById: vi.fn(),
      updateExercise: vi.fn(),
      deleteExercise: vi.fn(),
      markExerciseAsDone: vi.fn(),
    })),
  }
})

describe('Exercise Routes', () => {
  let server: any
  let exerciseController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'TRAINER' })

    await server.register(exerciseRoutes)

    // Get the mocked controller instance
    exerciseController = (ExerciseController as any).mock.results[0].value

    // Set up the mock implementations
    exerciseController.createExercise.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockExerciseService.createExercise())
    })

    exerciseController.getExerciseById.mockImplementation(
      async (req, reply) => {
        return reply.send(mockExerciseService.getExerciseById())
      }
    )

    exerciseController.updateExercise.mockImplementation(async (req, reply) => {
      return reply.send(mockExerciseService.updateExercise())
    })

    exerciseController.deleteExercise.mockImplementation(async (req, reply) => {
      return reply.send({ message: 'Exercise deleted successfully' })
    })

    exerciseController.markExerciseAsDone.mockImplementation(
      async (req, reply) => {
        return reply.send(mockExerciseService.markExerciseAsDone())
      }
    )
  })

  describe('POST /', () => {
    it('should create an exercise', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          name: 'Bench Press',
          variation: 'Barbell',
          repetitions: 10,
          sets: 3,
          trainingDayId: 'training-day-id',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(exerciseController.createExercise).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('repetitions')
      expect(responseBody).toHaveProperty('sets')
      expect(responseBody).toHaveProperty('trainingDayId')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          // Missing name and trainingDayId
          repetitions: 10,
          sets: 3,
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /:id', () => {
    it('should get an exercise by ID', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/exercise-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(exerciseController.getExerciseById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('repetitions')
      expect(responseBody).toHaveProperty('sets')
      expect(responseBody).toHaveProperty('seriesResults')
    })
  })

  describe('PUT /:id', () => {
    it('should update an exercise', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/exercise-id',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          name: 'Updated Bench Press',
          repetitions: 12,
          sets: 4,
        },
      })

      expect(response.statusCode).toBe(200)
      expect(exerciseController.updateExercise).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('repetitions')
      expect(responseBody).toHaveProperty('sets')
    })
  })

  describe('DELETE /:id', () => {
    it('should delete an exercise', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/exercise-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(exerciseController.deleteExercise).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody.message).toBe('Exercise deleted successfully')
    })
  })

  describe('PATCH /:id/done', () => {
    it('should mark an exercise as done', async () => {
      // Mock JWT verification for student
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

      const response = await server.inject({
        method: 'PATCH',
        url: '/exercise-id/done',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(exerciseController.markExerciseAsDone).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('done')
      expect(responseBody.done).toBe(true)
    })
  })
})
