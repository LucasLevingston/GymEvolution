import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { getUserByEmailService } from 'services/user/get-by-email';

export async function login(
  request: FastifyRequest<{ Body: { email: string; password: string } }>
): Promise<User | null> {
  const { email, password } = request.body;

  const user = await getUserByEmailService(email);

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordCorrect = user.password === password;
  if (!isPasswordCorrect) {
    throw new Error('Invalid password');
  }

  return user;
}
