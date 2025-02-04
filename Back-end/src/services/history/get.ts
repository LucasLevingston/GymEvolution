import { History } from '@prisma/client';
import { getUserByIdService } from 'services/user/get-by-id';
import { prisma } from 'utils/prisma';

export async function getHistory(id: string): Promise<History[]> {
  try {
    const user = getUserByIdService(id);

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.history.findMany({
      where: { userId: id },
    });
  } catch (error) {
    console.error('Error retrieving history:', error);
    throw new Error('Error retrieving history');
  }
}
