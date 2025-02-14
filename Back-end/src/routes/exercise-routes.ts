import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getExerciseController } from 'controllers/exercise/get';
import { createExerciseController } from 'controllers/exercise/create';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateExerciseController } from 'controllers/exercise/update';
import { deleteExerciseController } from 'controllers/exercise/delete';

export async function exerciseRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{
      Body: {
        name: string;
        variation?: string;
        repetitions: number;
        sets: number;
        done: boolean;
        trainingDayId: string;
      };
    }>(
      '/create',
      {
        schema: {
          summary: 'Create a new exercise',
          description: 'This endpoint allows creation of a new exercise.',
          tags: ['Exercises'],
          body: z.object({
            name: z.string(),
            variation: z.string().optional(),
            repetitions: z.number().int().positive(),
            sets: z.number().int().positive(),
            done: z.boolean(),
            trainingDayId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              name: z.string(),
              variation: z.string().nullable(),
              repetitions: z.number(),
              sets: z.number(),
              done: z.boolean(),
              trainingDayId: z.string().uuid(),
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
      createExerciseController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get an exercise by ID',
          description: 'This endpoint retrieves an exercise by its ID.',
          tags: ['Exercises'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              variation: z.string().nullable(),
              repetitions: z.number(),
              sets: z.number(),
              done: z.boolean(),
              trainingDayId: z.string().uuid(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      getExerciseController
    )
    .put<{
      Params: { id: string };
      Body: {
        name?: string;
        variation?: string;
        repetitions?: number;
        sets?: number;
        done?: boolean;
      };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update an exercise',
          description: 'This endpoint allows updating an existing exercise.',
          tags: ['Exercises'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            variation: z.string().optional(),
            repetitions: z.number().int().positive().optional(),
            sets: z.number().int().positive().optional(),
            done: z.boolean().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              variation: z.string().nullable(),
              repetitions: z.number(),
              sets: z.number(),
              done: z.boolean(),
              trainingDayId: z.string().uuid(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      updateExerciseController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete an exercise',
          description: 'This endpoint allows deletion of an exercise.',
          tags: ['Exercises'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      deleteExerciseController
    );
}
