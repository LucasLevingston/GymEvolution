import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function getUserByEmailService(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}
