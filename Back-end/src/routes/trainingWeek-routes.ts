import { FastifyInstance } from 'fastify';
import { createTrainingWeekController } from '../controllers/trainingWeekController';

export async function trainingWeekRoutes(fastify: FastifyInstance) {
  const trainingWeekController = new createTrainingWeekController();

  fastify.post('/training-week', createTrainingWeekController);
}
