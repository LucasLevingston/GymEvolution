import { ClientError } from 'errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';

export async function createTrainingWeekController(
  request: FastifyRequest<{
    Body: {
      weekNumber: number;
      current: boolean;
      information?: string;
      done: boolean;
      userId: string;
      trainingDays: Array<{
        group: string;
        dayOfWeek: string;
        done: boolean;
        comments?: string;
        exercises: Array<{
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
    const { userId } = request.body;
    console.log(request.body);
    if (!userId) {
      throw new ClientError('User ID is required');
    }
    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) throw new ClientError('User not exists');

    const trainingWeek = await prisma.trainingWeek.create({
      data: {
        weekNumber: request.body.weekNumber,
        current: request.body.current,
        information: request.body.information,
        done: request.body.done,
        user: {
          connect: { id: request.body.userId },
        },
        trainingDays: {
          create: request.body.trainingDays.map((day) => ({
            group: day.group,
            dayOfWeek: day.dayOfWeek,
            done: day.done,
            comments: day.comments,
            exercises: {
              create: day.exercises.map((exercise) => ({
                name: exercise.name,
                variation: exercise.variation,
                repetitions: exercise.repetitions,
                sets: exercise.sets,
                done: exercise.done,
              })),
            },
          })),
        },
      },
    });
    return reply.code(201).send(trainingWeek);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
