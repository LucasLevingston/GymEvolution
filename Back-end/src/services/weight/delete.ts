import { prisma } from 'utils/prisma';

export const deleteWeightService = async (id: string) => {
  await prisma.weight.delete({ where: { id } });
};
