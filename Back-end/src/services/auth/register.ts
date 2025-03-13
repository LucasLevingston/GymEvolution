import { User } from '@prisma/client';
import { prisma } from 'lib/prisma';

export async function registerUserService(data: {
  email: string;
  password: string;
}): Promise<User> {
  return await prisma.user.create({
    data,
  });
}
