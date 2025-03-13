import type { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/authenticate'

export async function trainingDayRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('onRequest', authenticate)

  // app.post("/", trainingDayController.createTrainingDay)
  // app.get("/:id", trainingDayController.getTrainingDayById)
  // app.put("/:id", trainingDayController.updateTrainingDay)
  // app.delete("/:id", trainingDayController.deleteTrainingDay)
  // app.patch("/:id/done", trainingDayController.markTrainingDayAsDone)
}
