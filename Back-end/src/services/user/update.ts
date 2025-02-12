import { User, History, Weight, TrainingWeek, Diet } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function updateUserService(
  updatedUser: User & {
    histories?: History[];
    weights?: Weight[];
    trainingWeeks?: TrainingWeek[];
    diets?: Diet[];
  }
) {
  // Verifica se o usuário existe
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

  // Atualiza os dados do usuário
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
      currentWeight: updatedUser.currentWeight ?? existingUser.currentWeight,
      email: updatedUser.email ?? existingUser.email,
      password: updatedUser.password ?? existingUser.password, // Considere hash
      history: {
        // Atualiza ou cria novos registros de histórico
        upsert: updatedUser.histories?.map((history) => ({
          where: { id: history.id },
          create: history,
          update: history,
        })),
      },
      oldWeights: {
        // Atualiza ou cria novos registros de peso
        upsert: updatedUser.weights?.map((weight) => ({
          where: { id: weight.id },
          create: weight,
          update: weight,
        })),
      },
      trainingWeeks: {
        // Atualiza ou cria novas semanas de treino
        upsert: updatedUser.trainingWeeks?.map((trainingWeek) => ({
          where: { id: trainingWeek.id },
          create: trainingWeek,
          update: trainingWeek,
        })),
      },
      diets: {
        // Atualiza ou cria novas dietas
        upsert: updatedUser.diets?.map((diet) => ({
          where: { id: diet.id },
          create: diet,
          update: diet,
        })),
      },
    },
  });

  // Remove a senha da resposta
  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
}
