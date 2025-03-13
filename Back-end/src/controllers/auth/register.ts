import type { FastifyRequest } from 'fastify';
import { registerUserService } from '../../services/auth/register';
import { getUserByEmailService } from 'services/user/get-by-email';
import { ClientError } from 'errors/client-error';
import { generateToken, hashPassword } from 'utils/jwt';
import { createHistoryEntry } from 'services/history/create-history-entry';

export async function registerController(
  request: FastifyRequest<{
    Body: {
      name: string;
      email: string;
      password: string;
    };
  }>
) {
  const { email, password } = request.body;
  try {
    const verifyIfUserExists = await getUserByEmailService(email);
    if (verifyIfUserExists) {
      throw new ClientError('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await registerUserService({
      ...request.body,
      password: hashedPassword,
    });

    await createHistoryEntry(user.id, 'User registered');

    const token = generateToken(user.id);

    return { user, token };
  } catch (error) {
    throw error;
  }
}
