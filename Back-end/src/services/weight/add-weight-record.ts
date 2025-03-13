import { prisma } from '../../lib/prisma';

interface AddWeightRecordParams {
  weight: string;
  bf: string;
  date: string;
  userId: string;
}

export async function addWeightRecord({
  weight,
  bf,
  date,
  userId,
}: AddWeightRecordParams) {
  const weightRecord = await prisma.weight.create({
    data: {
      weight,
      bf,
      date,
      userId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentWeight: weight,
    },
  });

  return weightRecord;
}
