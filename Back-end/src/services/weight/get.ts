import { prisma } from 'utils/prisma';

export const getWeightService = async (id: string) => {
  return await prisma.weight.findUnique({ where: { id } });
};
