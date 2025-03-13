import { Prisma } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import type { FastifyInstance } from 'fastify';
import { ResponseSerializationError } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  console.log(error);
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Invalid input', errors: error.flatten().fieldErrors });
  }
  if (error instanceof ResponseSerializationError) {
    console.log(error);
    return reply.status(400).send({ message: 'Invalid input', error: error.cause });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    switch (error.code) {
      case 'P2002':
        reply.status(409).send({
          message: 'Error on database',
          error: 'Already exists.',
        });
        return;
      case 'P2003':
        reply.status(400).send({
          message: 'Error on database',
          error: 'Foreign key constraint failed.',
        });
        return;
      case 'P2025':
        reply.status(404).send({ message: 'Error on database', error: 'Not found' });
        return;
      default:
        reply.status(500).send({
          message: 'Database server error',
          error: 'Database error',
        });
        return;
    }
  }

  if (error instanceof ClientError) {
    if (error.message === 'Forbidden') {
      return reply.status(403).send({ message: 'Forbidden' });
    }
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    reply.status(400).send({ message: 'Invalid JSON payload' });
    return;
  }

  reply.status(500).send({ message: 'Internal server error' });
};
