import { FastifyReply, FastifyRequest } from 'fastify';
import { generateToken } from 'utils/auth';
import { getUserByEmailService } from 'services/user/get-by-email';
import { passwordRecoverService } from 'services/user/password-recover';
import { ClientError } from 'errors/client-error';
import { sendMail } from 'utils/sendMail';
import { env } from '../../env';

export async function passwordRecover(
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  try {
    const { email } = request.body;

    const user = await getUserByEmailService(email);
    if (!user) {
      throw new ClientError('User not found');
    }

    const token = generateToken(user.id);
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    const result = await passwordRecoverService(email, token, expirationDate);
    if (!result) throw new ClientError('Error on generate token');

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const emailSentResult = await sendMail(email, resetUrl);

    if (!emailSentResult) throw new ClientError('Error on send mail');

    reply.code(200).send({ message: 'Password reset email sent' });
  } catch (error) {
    throw error;
  }
}
