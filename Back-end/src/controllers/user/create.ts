import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { createUserService } from 'services/user/create';
import { getUserByIdService } from 'services/user/get-by-id';

export async function createUserController(
  request: FastifyRequest<{ Body: { newUser: User } }>
): Promise<User> {
  const { newUser } = request.body;

  const verifyIfUserExists = await getUserByIdService(newUser.id);

  if (verifyIfUserExists) {
    throw new Error('User already exists');
  }

  return await createUserService(newUser);
}
