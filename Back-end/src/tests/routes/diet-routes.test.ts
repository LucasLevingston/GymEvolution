import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { dietRoutes } from '../../routes/diet-routes'
import { DietController } from '../../controllers/diet-controller'
import { mockDietService } from '../mocks/services'

vi.mock('../../controllers/diet-controller', () => {
  return {
    DietController: vi.fn().mockImplementation(() => ({
      createDiet: vi.fn(),
      getAllDiets: vi.fn(),
      getDietById: vi.fn(),
      updateDiet: vi.fn(),
      deleteDiet: vi.fn(),
    })),
  }
})

describe('Diet Routes', () => {
  let server: any
  let dietController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'NUTRITIONIST' })

    await server.register(dietRoutes)

    // Get the mocked controller instance
    dietController = (DietController as any).mock.results[0].value

    // Set up the mock implementations
    dietController.createDiet.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockDietService.createDiet())
    })

    dietController.getAllDiets.mockImplementation(async (req, reply) => {
      return reply.send(mockDietService.getAllDiets())
    })

    dietController.getDietById.mockImplementation(async (req, reply) => {
      return reply.send(mockDietService.getDietById())
    })

    dietController.updateDiet.mockImplementation(async (req, reply) => {
      return reply.send(mockDietService.updateDiet())
    })

    dietController.deleteDiet.mockImplementation(async (req, reply) => {
      return reply.send({ message: 'Diet deleted successfully' })
    })
  })

  describe('POST /', () => {
    it('should create a diet', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          weekNumber: 1,
          totalCalories: 2000,
          totalProtein: 150,
          totalCarbohydrates: 200,
          totalFat: 70,
        },
      })

      expect(response.statusCode).toBe(201)
      expect(dietController.createDiet).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weekNumber')
      expect(responseBody).toHaveProperty('totalCalories')
      expect(responseBody).toHaveProperty('totalProtein')
      expect(responseBody).toHaveProperty('totalCarbohydrates')
      expect(responseBody).toHaveProperty('totalFat')
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
          totalCalories: 2000,
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /', () => {
    it('should get all diets', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(dietController.getAllDiets).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })

    it('should get diets for a student', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/?studentId=student-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(dietController.getAllDiets).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })

  describe('GET /:id', () => {
    it('should get a diet by ID', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/diet-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(dietController.getDietById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weekNumber')
      expect(responseBody).toHaveProperty('totalCalories')
      expect(responseBody).toHaveProperty('meals')
      expect(responseBody).toHaveProperty('User')
    })
  })

  describe('PUT /:id', () => {
    it('should update a diet', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/diet-id',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          weekNumber: 2,
          totalCalories: 2200,
          totalProtein: 160,
        },
      })

      expect(response.statusCode).toBe(200)
      expect(dietController.updateDiet).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('weekNumber')
      expect(responseBody).toHaveProperty('totalCalories')
    })
  })

  describe('DELETE /:id', () => {
    it('should delete a diet', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/diet-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(dietController.deleteDiet).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody.message).toBe('Diet deleted successfully')
    })
  })
})
