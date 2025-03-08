import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '@/middlewares/authenticate';
import { AuthController } from '@/controllers/auth-controller';
import { errorResponseSchema } from 'schemas/error-schema';
import { userResponseSchema } from 'schemas/userSchema';

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();
  const server = app.withTypeProvider<ZodTypeProvider>();

  const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['STUDENT', 'NUTRITIONIST', 'TRAINER']).default('STUDENT'),
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
    authController.register
  );

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const loginResponseSchema = z.object({
    user: userResponseSchema,
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
    authController.login
  );

  // Forgot password schema
  const forgotPasswordSchema = z.object({
    email: z.string().email(),
  });

  const forgotPasswordResponseSchema = z.object({
    message: z.string(),
    resetToken: z.string().optional(),
  });

  server.post(
    '/forgot-password',
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
    authController.forgotPassword
  );

  // Reset password schema
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
    authController.resetPassword
  );

  // Get current user schema
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
    authController.getCurrentUser
  );
}
