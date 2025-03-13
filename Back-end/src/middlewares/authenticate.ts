import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { ClientError } from '../errors/client-error';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ClientError('No token provided');
    }
    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new ClientError('Invalid or expired token');
    }

    request.user = typeof decoded === 'string' ? { userId: decoded } : (decoded as any);
  } catch (err: any) {
    return reply.status(401).send({ message: err.message });
  }
}
