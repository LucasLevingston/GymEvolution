import { History } from '@prisma/client';
import { prisma } from '../database/prisma.client';
import { HistoryRepository } from '../interfaces/user.interface';

class HistoryService implements HistoryRepository {
  async getHistory(email: string): Promise<History[] | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const historyRecords = await prisma.history.findMany({
        where: { userId: user.id },
      });

      const history: History[] = historyRecords.map((record) => ({
        id: record.id,
        event: record.event,
        date: record.date,
        userId: record.userId,
      }));

      return historyRecords;
    } catch (error) {
      console.error('Error retrieving history:', error);
      throw new Error('Error retrieving history');
    }
  }
}

export { HistoryService };
