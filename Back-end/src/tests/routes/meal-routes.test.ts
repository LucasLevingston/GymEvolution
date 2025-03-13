import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { mealRoutes } from '../../routes/meal-routes'
import { MealController } from '../../controllers/meal-controller'
import { mockMealService } from '../mocks/services'

vi.mock('../../controllers/meal-controller', () => {
  return {
    MealController: vi.fn().mockImplementation(() => ({
      createMeal: vi.fn(),
      getMealById: vi.fn(),
      updateMeal: vi.fn(),
      deleteMeal: vi.fn(),
      markMealAsCompleted: vi.fn(),
    })),
  }
})

describe('Meal Routes', () => {
  let server: any
  let mealController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'NUTRITIONIST' })

    await server.register(mealRoutes)

    // Get the mocked controller instance
    mealController = (MealController as any).mock.results[0].value

    // Set up the mock implementations
    mealController.createMeal.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockMealService.createMeal())
    })

    mealController.getMealById.mockImplementation(async (req, reply) => {
      return reply.send(mockMealService.getMealById())
    })

    mealController.updateMeal.mockImplementation(async (req, reply) => {
      return reply.send(mockMealService.updateMeal())
    })

    mealController.deleteMeal.mockImplementation(async (req, reply) => {
      return reply.send({ message: 'Meal deleted successfully' })
    })

    mealController.markMealAsCompleted.mockImplementation(
      async (req, reply) => {
        return reply.send(mockMealService.markMealAsCompleted())
      }
    )
  })

  describe('POST /', () => {
    it('should create a meal', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          name: 'Breakfast',
          calories: 500,
          protein: 30,
          carbohydrates: 50,
          fat: 20,
          dietId: 'diet-id',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(mealController.createMeal).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('calories')
      expect(responseBody).toHaveProperty('protein')
      expect(responseBody).toHaveProperty('carbohydrates')
      expect(responseBody).toHaveProperty('fat')
      expect(responseBody).toHaveProperty('dietId')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          // Missing name and dietId
          calories: 500,
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /:id', () => {
    it('should get a meal by ID', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/meal-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealController.getMealById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('calories')
      expect(responseBody).toHaveProperty('mealItems')
    })
  })

  describe('PUT /:id', () => {
    it('should update a meal', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/meal-id',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          name: 'Updated Breakfast',
          calories: 550,
          protein: 35,
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealController.updateMeal).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('calories')
    })
  })

  describe('DELETE /:id', () => {
    it('should delete a meal', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/meal-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealController.deleteMeal).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody.message).toBe('Meal deleted successfully')
    })
  })

  describe('PATCH /:id/complete', () => {
    it('should mark a meal as completed', async () => {
      // Mock JWT verification for student
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

      const response = await server.inject({
        method: 'PATCH',
        url: '/meal-id/complete',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealController.markMealAsCompleted).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('isCompleted')
      expect(responseBody.isCompleted).toBe(true)
    })
  })
})
