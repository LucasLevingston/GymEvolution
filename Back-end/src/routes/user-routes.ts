import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';
import { User } from '@prisma/client';
import { HistoryController } from '../controllers/historyController';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();
  const historyController = new HistoryController();

  fastify.post<{ Body: User }>('/create', async (req, reply) => {
    const user = req.body;

    try {
      const data = await userController.create(user);
      return reply.send(data);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  fastify.post<{
    Body: { email: string; password: string };
  }>('/login', async (req, reply) => {
    const { email, password } = req.body;
    try {
      const data = await userController.login(email, password);
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.put<{ Body: User }>('/', async (req, reply) => {
    const updatedUser = req.body;
    try {
      const result = await userController.updateUser(updatedUser);
      return result;
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get('/:email', async (req, reply) => {
    const params = req.params;
    if (typeof params === 'object' && params && 'email' in params) {
      const email = params.email;
      try {
        const data = await userController.getUser(String(email));
        reply.send(data);
      } catch (error) {
        reply.status(500).send({
          error: 'Internal Server Error',
        });
      }
    } else {
      reply.status(400).send({
        error: 'Bad Request',
        message: 'Invalid params object or missing email property',
      });
    }
  });
  fastify.get<{ Body: { email: string } }>('/history', async (req, reply) => {
    const { email } = req.body;
    try {
      const result = await historyController.getHistory(email);
      return result;
    } catch (error) {
      reply.send(error);
    }
  });
}
