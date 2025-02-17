import { FastifyReply, FastifyRequest } from 'fastify';
import { resetPasswordService } from 'services/user/reset-password';

export async function resetPassword(
  request: FastifyRequest<{ Body: { newPassword: string; token: string } }>,
  reply: FastifyReply
) {
  try {
    const { newPassword, token } = request.body;
    await resetPasswordService(token, newPassword);

    reply.code(200).send({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error);
  }
}
