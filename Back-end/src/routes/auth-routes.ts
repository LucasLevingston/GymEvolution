import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { registerController } from '../controllers/auth/register';
import { loginController } from '../controllers/auth/login';
import { passwordRecover } from '../controllers/auth/password-recover';
import { resetPasswordController } from '../controllers/auth/reset-password';
import { getCurrentUserController } from '../controllers/auth/get-current-user';
import { errorResponseSchema } from 'schemas/error-schema';
import { userResponseSchema, userSchema } from 'schemas/userSchema';

export async function authRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerResponseSchema = z.object({
    user: userResponseSchema,
    token: z.string(),
  });

  server.post(
    '/register',
    {
      schema: {
        body: registerSchema,
        response: {
          201: registerResponseSchema,
          409: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Register a new user',
        description: 'Register a new user with name, email, password, and role',
      },
    },
    registerController
  );

  const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  });

  const loginResponseSchema = z.object({
    user: userSchema,
    token: z.string(),
  });

  server.post(
    '/login',
    {
      schema: {
        body: loginSchema,
        response: {
          200: loginResponseSchema,
          401: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Login a user',
        description: 'Login a user with email and password',
      },
    },
    loginController
  );

  const forgotPasswordSchema = z.object({
    email: z.string().email(),
  });

  const forgotPasswordResponseSchema = z.object({
    message: z.string(),
    resetToken: z.string().optional(),
  });

  server.post(
    '/password-recover',
    {
      schema: {
        body: forgotPasswordSchema,
        response: {
          200: forgotPasswordResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Request password reset',
        description: 'Request a password reset link for a user',
      },
    },
    passwordRecover
  );

  const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6),
  });

  const resetPasswordResponseSchema = z.object({
    message: z.string(),
  });

  server.post(
    '/reset-password',
    {
      schema: {
        body: resetPasswordSchema,
        response: {
          200: resetPasswordResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Reset password',
        description: 'Reset a user password with a valid token',
      },
    },
    resetPasswordController
  );

  server.get(
    '/me',
    {
      onRequest: [authenticate],
      schema: {
        response: {
          200: userResponseSchema,
          401: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Get current user',
        description: 'Get the current authenticated user',
        security: [{ bearerAuth: [] }],
      },
    },
    getCurrentUserController
  );
}
