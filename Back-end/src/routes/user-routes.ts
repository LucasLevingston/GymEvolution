import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';
import { createUserController } from 'controllers/user/create';
import { login } from 'controllers/user/login';
import { updateUser } from 'controllers/user/update';
import { getUser } from 'controllers/user/get';
import { getHistoryController } from 'controllers/history/get';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: { newUser: User } }>('/create', {}, createUserController);

  fastify.post<{
    Body: { email: string; password: string };
  }>('/login', {}, login);

  fastify.put<{ Body: { updatedUser: User } }>('/', {}, updateUser);

  fastify.get<{ Params: { id: string } }>('/:id', {}, getUser);

  fastify.get<{ Params: { id: string } }>('/:id/history', {}, getHistoryController);
}
