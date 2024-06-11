import { FastifyInstance } from 'fastify';
import { UserUseCase } from '../usecases/user.usercase';
import { User, UserCreate } from '../interfaces/user.interface';
import { HistoricoUseCase } from '../usecases/historico.usecase';

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();
  const historicoUseCase = new HistoricoUseCase();
  fastify.post<{ Body: UserCreate }>('/create', async (req, reply) => {
    const { senha, email } = req.body;
    try {
      const data = await userUseCase.create({ senha, email });

      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
  fastify.post<{
    Body: { email: string; senha: string };
  }>('/login', async (req, reply) => {
    const { email, senha } = req.body;
    try {
      const data = await userUseCase.login(email, senha);
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
  fastify.put<{
    Body: { email: string; field: string; novoValor: string };
  }>('/update', async (req, reply) => {
    const { email, field, novoValor } = req.body;
    try {
      const result = await userUseCase.alterarDado(email, field, novoValor);
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
        const data = await userUseCase.getUser(String(email));
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
  fastify.get<{ Body: { email: string } }>('/historico', async (req, reply) => {
    const { email } = req.body;
    try {
      const result = await historicoUseCase.getHistorico(email);
      return result;
    } catch (error) {
      reply.send(error);
    }
  });
}
