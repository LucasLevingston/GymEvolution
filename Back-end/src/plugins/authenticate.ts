import type {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  HookHandlerDoneFunction,
} from 'fastify';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
}

export function registerAuthenticatePlugin(app: FastifyInstance) {
  app.decorate('authenticate', authenticate);
}
