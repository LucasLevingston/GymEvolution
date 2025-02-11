import { User } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createUserService } from 'services/user/create';
import { getUserByEmailService } from 'services/user/get-by-email';
import { hashPassword } from 'utils/auth';

export async function createUserController(
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body;

    const verifyIfUserExists = await getUserByEmailService(email);
    if (verifyIfUserExists) {
      throw new ClientError('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const result = await createUserService({ email, password: hashedPassword });

    return { id: result.id, email: result.email };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
