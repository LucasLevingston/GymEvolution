import { History, User } from '@prisma/client';
import { prisma } from '../database/prisma.client';
import { HistoryRepository } from '../interfaces/user.interface';

class HistoryService implements HistoryRepository {
  async getHistory(email: string): Promise<History[]> {
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

      return historyRecords;
    } catch (error) {
      console.error('Error retrieving history:', error);
      throw new Error('Error retrieving history');
    }
  }

  async addToHistory(updatedUser: User): Promise<History[] | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: updatedUser.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await this.validateEvent(user, updatedUser);

      return await this.getHistory(user.email);
    } catch (error) {
      console.error('Error adding to history:', error);
      throw new Error('Error adding to history');
    }
  }

  private async validateEvent(user: User, updatedUser: User) {
    const changes: string[] = [];
    const fieldsToCheck: Array<keyof User> = [
      'name',
      'email',
      'street',
      'number',
      'zipCode',
      'city',
      'state',
      'sex',
      'phone',
      'birthDate',
    ];

    fieldsToCheck.forEach((field) => {
      if (user[field] !== updatedUser[field]) {
        changes.push(
          `O campo ${field} foi alterado de ${user[field]} para ${updatedUser[field]}`
        );
      }
    });

    if (changes.length > 0) {
      for (const change of changes) {
        await prisma.history.create({
          data: {
            event: change,
            date: new Date().toISOString(),
            userId: user.id,
          },
        });
      }
    }
  }
}

export { HistoryService };
