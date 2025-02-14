import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';

export async function updateTrainingWeekController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: {
      weekNumber: number;
      current: boolean;
      information?: string;
      done: boolean;
      userId: string;
      trainingDays: Array<{
        id: string;
        group: string;
        dayOfWeek: string;
        done: boolean;
        comments?: string;
        exercises: Array<{
          id: string;
          name: string;
          variation?: string;
          repetitions: number;
          sets: number;
          done: boolean;
        }>;
      }>;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { weekNumber, current, information, done, userId, trainingDays } = request.body;

    const trainingWeek = await prisma.trainingWeek.update({
      where: { id },
      data: {
        weekNumber,
        current,
        information,
        done,
        user: {
          connect: { id: userId },
        },
        trainingDays: {
          upsert: trainingDays.map((day) => ({
            where: { id: day.id },
            update: {
              group: day.group,
              dayOfWeek: day.dayOfWeek,
              done: day.done,
              comments: day.comments,
              exercises: {
                upsert: day.exercises.map((exercise) => ({
                  where: { id: exercise.id },
                  update: {
                    name: exercise.name,
                    variation: exercise.variation,
                    repetitions: exercise.repetitions,
                    sets: exercise.sets,
                    done: exercise.done,
                  },
                  create: {
                    id: exercise.id,
                    name: exercise.name,
                    variation: exercise.variation,
                    repetitions: exercise.repetitions,
                    sets: exercise.sets,
                    done: exercise.done,
                  },
                })),
              },
            },
            create: {
              id: day.id,
              group: day.group,
              dayOfWeek: day.dayOfWeek,
              done: day.done,
              comments: day.comments,
              exercises: {
                create: day.exercises.map((exercise) => ({
                  id: exercise.id,
                  name: exercise.name,
                  variation: exercise.variation,
                  repetitions: exercise.repetitions,
                  sets: exercise.sets,
                  done: exercise.done,
                })),
              },
            },
          })),
        },
      },
    });
    console.log(trainingWeek);
    return reply.status(200).send(trainingWeek);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
