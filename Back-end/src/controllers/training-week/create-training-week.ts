import type { FastifyRequest } from 'fastify';
import { createTrainingWeek } from '@/services/training-week/create-training-week';
import { isTrainerAssignedToStudent } from '@/services/training-week/is-trainer-assigned-to-student';
import { ClientError } from 'errors/client-error';

interface Exercise {
  name: string;
  variation?: string;
  repetitions: number;
  sets: number;
  done?: boolean;
}

interface TrainingDay {
  group: string;
  dayOfWeek: string;
  comments?: string;
  done?: boolean;
  exercises?: Exercise[];
}

interface Body {
  weekNumber: number;
  information?: string;
  studentId?: string;
  trainingDays: TrainingDay[];
}

export async function createTrainingWeekController(
  request: FastifyRequest<{
    Body: Body;
  }>
) {
  try {
    const { userId, role } = request.user;
    const { weekNumber, information, studentId, trainingDays } = request.body;

    let targetUserId = userId;

    if (role === 'TRAINER' && studentId) {
      const isAssigned = await isTrainerAssignedToStudent(userId, studentId);

      if (!isAssigned) {
        throw new ClientError('You are not assigned to this student');
      }

      targetUserId = studentId;
    } else if (studentId && role !== 'STUDENT') {
      throw new ClientError('Only trainers can create training weeks for students');
    }

    const trainingWeek = await createTrainingWeek({
      weekNumber,
      information,
      userId: targetUserId,
      trainingDays,
    });

    return trainingWeek;
  } catch (error) {
    throw error;
  }
}
