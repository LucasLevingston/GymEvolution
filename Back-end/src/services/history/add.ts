import { History, User } from '@prisma/client';
import { prisma } from 'utils/prisma';
import { validateEvent } from 'utils/validate-event';
import { getHistory } from './get';
import { getUserByIdService } from 'services/user/get-by-id';

export async function addToHistory(updatedUser: User): Promise<History[] | null> {
  try {
    const user = await getUserByIdService(updatedUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    await validateEvent(user, updatedUser);

    return await getHistory(user.email);
  } catch (error) {
    throw new Error('Error adding to history');
  }
}
