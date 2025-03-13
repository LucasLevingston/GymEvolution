import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { serieRoutes } from '../../routes/serie-routes'
import { SerieController } from '../../controllers/serie-controller'
import { mockSerieService } from '../mocks/services'

vi.mock('../../controllers/serie-controller', () => {
  return {
    SerieController: vi.fn().mockImplementation(() => ({
      createSerie: vi.fn(),
      getSerieById: vi.fn(),
      updateSerie: vi.fn(),
      deleteSerie: vi.fn(),
    })),
  }
})

describe('Serie Routes', () => {
  let server: any
  let serieController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

    await server.register(serieRoutes)

    // Get the mocked controller instance
    serieController = (SerieController as any).mock.results[0].value

    // Set up the mock implementations
    serieController.createSerie.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockSerieService.createSerie())
    })

    serieController.getSerieById.mockImplementation(async (req, reply) => {
      return reply.send(mockSerieService.getSerieById())
    })

    serieController.updateSerie.mockImplementation(async (req, reply) => {
      return reply.send(mockSerieService.updateSerie())
    })

    serieController.deleteSerie.mockImplementation(async (req, reply) => {
      return reply.send({ message: 'Serie deleted successfully' })
    })
  })

  describe('POST /', () => {
    it('should create a serie', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          seriesIndex: 0,
          repetitions: 10,
          weight: 100,
          exerciseId: 'exercise-id',
        },
      })

      expect(response.statusCode).toBe(201)
      expect(serieController.createSerie).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('seriesIndex')
      expect(responseBody).toHaveProperty('repetitions')
      expect(responseBody).toHaveProperty('weight')
      expect(responseBody).toHaveProperty('exerciseId')
    })

    it('should validate the request body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          // Missing seriesIndex, repetitions, weight, and exerciseId
        },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /:id', () => {
    it('should get a serie by ID', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/serie-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(serieController.getSerieById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('seriesIndex')
      expect(responseBody).toHaveProperty('repetitions')
      expect(responseBody).toHaveProperty('weight')
      expect(responseBody).toHaveProperty('exerciseId')
    })
  })

  describe('PUT /:id', () => {
    it('should update a serie', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/serie-id',
        headers: {
          authorization: 'Bearer token',
        },
        payload: {
          repetitions: 12,
          weight: 110,
        },
      })

      expect(response.statusCode).toBe(200)
      expect(serieController.updateSerie).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('id')
      expect(responseBody).toHaveProperty('seriesIndex')
      expect(responseBody).toHaveProperty('repetitions')
      expect(responseBody).toHaveProperty('weight')
    })
  })

  describe('DELETE /:id', () => {
    it('should delete a serie', async () => {
      // Mock JWT verification for trainer
      server.jwt.verify = vi
        .fn()
        .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' })

      const response = await server.inject({
        method: 'DELETE',
        url: '/serie-id',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(serieController.deleteSerie).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty('message')
      expect(responseBody.message).toBe('Serie deleted successfully')
    })
  })
})
