import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function createUserService(data: User): Promise<User> {
  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
    },
  });
}
