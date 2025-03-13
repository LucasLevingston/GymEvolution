import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTestServer } from '../utils/test-server'
import { historyRoutes } from '../../routes/history-routes'
import { HistoryController } from '../../controllers/history-controller'
import { mockHistoryService } from '../mocks/services'

vi.mock('../../controllers/history-controller', () => {
  return {
    HistoryController: vi.fn().mockImplementation(() => ({
      getUserHistory: vi.fn(),
    })),
  }
})

describe('History Routes', () => {
  let server: any
  let historyController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi
      .fn()
      .mockReturnValue({ id: 'user-id', role: 'STUDENT' })

    await server.register(historyRoutes)

    // Get the mocked controller instance
    historyController = (HistoryController as any).mock.results[0].value

    // Set up the mock implementations
    historyController.getUserHistory.mockImplementation(async (req, reply) => {
      return reply.send(mockHistoryService.getUserHistory())
    })
  })

  describe('GET /', () => {
    it('should get user history', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          authorization: 'Bearer token',
        },
      })

      expect(response.statusCode).toBe(200)
      expect(historyController.getUserHistory).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })

    it('should get history for a student', async () => {
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
      expect(historyController.getUserHistory).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })
})
