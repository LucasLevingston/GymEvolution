import { prisma } from '../../lib/prisma';
import { Diet, History, TrainingWeek, User, Weight } from '@prisma/client';

export async function updateUser(
  updatedUser: User & {
    histories?: History[];
    oldWeights?: Weight[];
    trainingWeeks?: TrainingWeek[];
    diets?: Diet[];
  }
) {
  const existingUser = await prisma.user.findUnique({
    where: { id: updatedUser.id },
    include: {
      history: true,
      oldWeights: true,
      trainingWeeks: true,
      diets: true,
    },
  });

  if (!existingUser) {
    throw new Error('User not found');
  }
  const sortedWeights = [...(updatedUser.oldWeights || [])].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const mostRecentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : null;

  const result = await prisma.user.update({
    where: { id: updatedUser.id },
    data: {
      name: updatedUser.name ?? existingUser.name,
      sex: updatedUser.sex ?? existingUser.sex,
      street: updatedUser.street ?? existingUser.street,
      number: updatedUser.number ?? existingUser.number,
      zipCode: updatedUser.zipCode ?? existingUser.zipCode,
      city: updatedUser.city ?? existingUser.city,
      state: updatedUser.state ?? existingUser.state,
      birthDate: updatedUser.birthDate ?? existingUser.birthDate,
      phone: updatedUser.phone ?? existingUser.phone,
      currentWeight:
        mostRecentWeight ?? updatedUser.currentWeight ?? existingUser.currentWeight,
      email: updatedUser.email ?? existingUser.email,
      password: updatedUser.password ?? existingUser.password,
      history: {
        upsert: updatedUser.histories?.map((history) => ({
          where: { id: history.id },
          create: history,
          update: history,
        })),
      },
      oldWeights: {
        create: updatedUser.oldWeights
          ?.filter((weight) => !weight.id)
          .map((weight) => ({
            weight: weight.weight,
            bf: weight.bf,
            date: weight.date,
          })),
        update: updatedUser.oldWeights
          ?.filter((weight) => weight.id)
          .map((weight) => ({
            where: { id: weight.id },
            data: {
              weight: weight.weight,
              bf: weight.bf,
              date: weight.date,
            },
          })),
      },
      trainingWeeks: {
        upsert: updatedUser.trainingWeeks?.map((trainingWeek) => ({
          where: { id: trainingWeek.id },
          create: trainingWeek,
          update: trainingWeek,
        })),
      },
      diets: {
        upsert: updatedUser.diets?.map((diet) => ({
          where: { id: diet.id },
          create: diet,
          update: diet,
        })),
      },
    },
  });

  return result;
}
