import type { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      role?: string;
    } & JwtPayload;
  }
}
