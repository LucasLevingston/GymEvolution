import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function getUserByIdService(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}
