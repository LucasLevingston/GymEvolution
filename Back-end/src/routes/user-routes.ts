import { FastifyInstance } from 'fastify';
import { User } from '@prisma/client';
import { createUserController } from 'controllers/user/create';
import { login } from 'controllers/user/login';
import { updateUser } from 'controllers/user/update';
import { getUser } from 'controllers/user/get';
import { getHistoryController } from 'controllers/history/get';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticate } from 'middlewares/auth.middleware';
import { passwordRecover } from 'controllers/user/password-recover';
import { resetPassword } from 'controllers/user/reset-password';

export async function userRoutes(app: FastifyInstance) {
  // app.addHook('onRequest', authenticate);

  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Body: { email: string; password: string } }>(
      '/create',
      {
        schema: {
          summary: 'Register a new user',
          description: 'This endpoint allows a new user to register.',
          tags: ['Users'],
          body: z.object({
            email: z.string().email('Invalid email address'),
            password: z.string().min(6, 'Password must be at least 6 characters long'),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              email: z.string(),
            }),
            400: z.object({
              error: z.string().optional(),
              message: z.string().optional(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      createUserController
    );

  app.withTypeProvider<ZodTypeProvider>().post<{
    Body: { email: string; password: string };
  }>(
    '/login',
    {
      schema: {
        summary: 'Login a user',
        description: 'This endpoint allows an existing user to login.',
        tags: ['Users'],
        body: z.object({
          email: z.string().email('Invalid email address'),
          password: z.string().min(6, 'Password must be at least 6 characters long'),
        }),
        response: {
          200: z.object({
            token: z.string(),
            user: z.object({
              id: z.string().uuid(),
              email: z.string(),
              name: z.string().optional(),
              sex: z.string().optional(),
              street: z.string().optional(),
              number: z.string().optional(),
              zipCode: z.string().optional(),
              city: z.string().optional(),
              state: z.string().optional(),
              birthDate: z.string().optional(),
              phone: z.string().optional(),
              currentWeight: z.string().optional(),
              trainingWeeks: z.any(),
              history: z.any(),
              oldWeights: z.any(),
              diets: z.any(),
            }),
          }),
          400: z.object({
            error: z.string().optional(),
            message: z.string().optional(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    login
  );

  app.withTypeProvider<ZodTypeProvider>().put<{ Body: User }>(
    '/',
    {
      schema: {
        summary: 'Update user details',
        description: 'This endpoint allows a user to update their details.',
        tags: ['Users'],
        body: z.object({
          id: z.string().uuid(),
          email: z.string().email('Invalid email address').optional(),
          name: z.string().optional(),
          sex: z.string().optional(),
          street: z.string().optional(),
          number: z.string().optional(),
          zipCode: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          birthDate: z.string().optional(),
          phone: z.string().optional(),
          currentWeight: z.string().optional(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            email: z.string().email().optional(),
            name: z.string().optional(),
            sex: z.string().optional(),
            street: z.string().optional(),
            number: z.string().optional(),
            zipCode: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            birthDate: z.string().optional(),
            phone: z.string().optional(),
            currentWeight: z.string().optional(),
          }),
          400: z.object({
            error: z.string().optional(),
            message: z.string().optional(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    updateUser
  );

  app.get<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        summary: 'Get user details',
        description: 'This endpoint retrieves user details by ID.',
        tags: ['Users'],
        params: z.object({
          id: z.string().uuid('Invalid user ID'),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            email: z.string().email().optional(),
            name: z.string().optional(),
            sex: z.string().optional(),
            street: z.string().optional(),
            number: z.string().optional(),
            zipCode: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            birthDate: z.string().optional(),
            phone: z.string().optional(),
            currentWeight: z.string().optional(),
            trainingWeeks: z.any(),
            history: z.any(),
            oldWeights: z.any(),
            diets: z.any(),
          }),
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    getUser
  );

  app.get<{ Params: { id: string } }>(
    '/:id/history',
    {
      schema: {
        summary: 'Get user history',
        description: 'This endpoint retrieves the history of a user by ID.',
        tags: ['Users'],
        params: z.object({
          id: z.string().uuid('Invalid user ID'),
        }),
        response: {
          200: z.array(
            z.object({
              // Define the structure of history items
              date: z.string(),
              activity: z.string(),
            })
          ),
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    getHistoryController
  );

  app.post(
    '/password-recover',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    passwordRecover
  );

  app.post(
    '/reset-password',
    {
      schema: {
        body: z.object({
          token: z.string(),
          newPassword: z.string().min(8),
        }),
      },
    },
    resetPassword
  );
}
