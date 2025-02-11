import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function createUserService(data: {
  email: string;
  password: string;
}): Promise<User> {
  return await prisma.user.create({
    data,
  });
}
