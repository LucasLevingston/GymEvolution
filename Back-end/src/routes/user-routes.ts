import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { getAllUsersController } from '../controllers/user/get-all-users';
import { getUserByIdController } from '../controllers/user/get-user-by-id';
import { updateUserController } from '../controllers/user/update-user';
import { deleteUserController } from '../controllers/user/delete-user';
import { getAllNutritionistsController } from '../controllers/user/get-all-nutritionists';
import { getAllTrainersController } from '../controllers/user/get-all-trainers';
import { assignNutritionistController } from '../controllers/user/assign-nutritionist';
import { assignTrainerController } from '../controllers/user/assign-trainer';
import { getNutritionistStudentsController } from '../controllers/user/get-nutritionist-students';
import { getTrainerStudentsController } from '../controllers/user/get-trainer-students';
import { idParamSchema } from '../schemas/common-schemas';
import { userResponseSchema, userSchema } from 'schemas/userSchema';
import { errorResponseSchema } from 'schemas/error-schema';

export async function userRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  const getAllUsersResponseSchema = z.array(userResponseSchema);

  server.get(
    '/',
    {
      schema: {
        response: {
          200: getAllUsersResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Get all users',
        description: 'Get all users (admin only)',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllUsersController
  );

  const getUserByIdResponseSchema = userResponseSchema.extend({
    sex: z.string().nullable(),
    birthDate: z.string().nullable(),
    phone: z.string().nullable(),
    currentWeight: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
  });

  server.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: userSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Get user by ID',
        description: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    getUserByIdController
  );

  server.put(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        body: z.any(),
        response: {
          200: userSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Update user',
        description: 'Update a user by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    updateUserController
  );

  const deleteUserResponseSchema = z.object({
    message: z.string(),
  });

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteUserResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Delete user',
        description: 'Delete a user by ID (admin only)',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteUserController
  );

  // Get all nutritionists schema
  const getNutritionistsResponseSchema = z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      email: z.string().email(),
    })
  );

  server.get(
    '/role/nutritionists',
    {
      schema: {
        response: {
          200: getNutritionistsResponseSchema,
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Get all nutritionists',
        description: 'Get all users with the nutritionist role',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllNutritionistsController
  );

  // Get all trainers schema
  const getTrainersResponseSchema = z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      email: z.string().email(),
    })
  );

  server.get(
    '/role/trainers',
    {
      schema: {
        response: {
          200: getTrainersResponseSchema,
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Get all trainers',
        description: 'Get all users with the trainer role',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllTrainersController
  );

  // Assign nutritionist schema
  const assignNutritionistSchema = z.object({
    studentId: z.string().uuid(),
    nutritionistId: z.string().uuid(),
  });

  const relationshipResponseSchema = z.object({
    id: z.string().uuid(),
    nutritionistId: z.string().uuid().nullable(),
    studentId: z.string().uuid().nullable(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  server.post(
    '/assign/nutritionist',
    {
      schema: {
        body: assignNutritionistSchema,
        response: {
          201: relationshipResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Assign nutritionist to student',
        description: 'Assign a nutritionist to a student',
        security: [{ bearerAuth: [] }],
      },
    },
    assignNutritionistController
  );

  // Assign trainer schema
  const assignTrainerSchema = z.object({
    studentId: z.string().uuid(),
    trainerId: z.string().uuid(),
  });

  server.post(
    '/assign/trainer',
    {
      schema: {
        body: assignTrainerSchema,
        response: {
          201: relationshipResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Assign trainer to student',
        description: 'Assign a trainer to a student',
        security: [{ bearerAuth: [] }],
      },
    },
    assignTrainerController
  );

  // Get nutritionist students schema
  const getStudentsResponseSchema = z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      email: z.string().email(),
      sex: z.string().nullable(),
      birthDate: z.string().nullable(),
      currentWeight: z.string().nullable(),
    })
  );

  server.get(
    '/nutritionist/students',
    {
      schema: {
        response: {
          200: getStudentsResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Get nutritionist students',
        description: 'Get all students assigned to the current nutritionist',
        security: [{ bearerAuth: [] }],
      },
    },
    getNutritionistStudentsController
  );

  // Get trainer students schema
  server.get(
    '/trainer/students',
    {
      schema: {
        response: {
          200: getStudentsResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['users'],
        summary: 'Get trainer students',
        description: 'Get all students assigned to the current trainer',
        security: [{ bearerAuth: [] }],
      },
    },
    getTrainerStudentsController
  );
}
