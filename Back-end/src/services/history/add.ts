import { History, User } from '@prisma/client';
import { prisma } from 'lib/prisma';
import { validateEvent } from 'utils/validate-event';
import { getUserHistory } from './get-user-history';
import { getUserByIdService } from 'services/user/get-user-by-id';

export async function addToHistory(updatedUser: User): Promise<History[] | null> {
  try {
    const user = await getUserByIdService(updatedUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    await validateEvent(user, updatedUser);

    return await getUserHistory(user.email);
  } catch (error) {
    throw new Error('Error adding to history');
  }
}
