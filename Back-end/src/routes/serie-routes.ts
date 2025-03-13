import type { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/authenticate'

export async function serieRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate)

  // app.post('/', createSerie);
  // app.get('/:id', getSerieById);
  // app.put('/:id', updateSerie);
  // app.delete('/:id', deleteSerie);
}
