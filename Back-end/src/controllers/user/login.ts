import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { getUserByEmailService } from 'services/user/get-by-email';
import { ClientError } from 'errors/client-error';
import { generateToken } from 'utils/auth';
import { loginService } from 'services/user/login';

export async function login(
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body;

    const user = await getUserByEmailService(email);

    if (!user) {
      throw new ClientError('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ClientError('Invalid password');
    }

    const token = generateToken(user.id);

    const result = await loginService(user.id);

    return {
      user: result,
      token,
    };
  } catch (error) {
    throw error;
  }
}
