import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { mealItemsRoutes } from '../../routes/meal-items-routes'
import { MealItemsController } from '../../controllers/meal-items-controller'
import { mockMealItemsService } from '../mocks/services'

vi.mock('../../controllers/meal-items-controller', () => {
  return {
    MealItemsController: vi.fn().mockImplementation(() => ({
      createMealItem: vi.fn(),
      getMealItemById: vi.fn(),
      updateMealItem: vi.fn(),
      deleteMealItem: vi.fn(),
    })),
  }
})

describe('Meal Items Routes', () => {
  let server: any
  let mealItemsController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'NUTRITIONIST' })

    await server.register(mealItemsRoutes)

    // Get the mocked controller instance
    mealItemsController = (MealItemsController as any).mock.results[0].value

    // Set up the mock implementations
    mealItemsController.createMealItem.mockImplementation(
      async (req, reply) => {
        return reply.status(201).send(mockMealItemsService.createMealItem())
      }
    )

    mealItemsController.getMealItemById.mockImplementation(
      async (req, reply) => {
        return reply.send(mockMealItemsService.getMealItemById())
      }
    )

    mealItemsController.updateMealItem.mockImplementation(
      async (req, reply) => {
        return reply.send(mockMealItemsService.updateMealItem())
      }
    )

    mealItemsController.deleteMealItem.mockImplementation(
      async (req, reply) => {
        return reply.send({ message: 'Meal item deleted successfully' })
      }
    )
  })

  describe('POST /', () => {
    it('should create a meal item', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          name: 'Eggs',
          quantity: 2,
          calories: 150,
          protein: 12,
          carbohydrates: 1,
          fat: 10,
          mealId: 'meal-id',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(mealItemsController.createMealItem).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('quantity')
      expect(responseBody).toHaveProperty('calories')
      expect(responseBody).toHaveProperty('protein')
      expect(responseBody).toHaveProperty('carbohydrates')
      expect(responseBody).toHaveProperty('fat')
      expect(responseBody).toHaveProperty('mealId')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          // Missing name, quantity, and mealId
          calories: 150,
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /:id', () => {
    it('should get a meal item by ID', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/meal-item-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealItemsController.getMealItemById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('quantity')
      expect(responseBody).toHaveProperty('calories')
    })
  })

  describe('PUT /:id', () => {
    it('should update a meal item', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/meal-item-id',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          name: 'Updated Eggs',
          quantity: 3,
          calories: 225,
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealItemsController.updateMealItem).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('name')
      expect(responseBody).toHaveProperty('quantity')
      expect(responseBody).toHaveProperty('calories')
    })
  })

  describe('DELETE /:id', () => {
    it('should delete a meal item', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/meal-item-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(mealItemsController.deleteMealItem).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody.message).toBe('Meal item deleted successfully')
    })
  })
})
