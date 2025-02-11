import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function getUserByIdService(
  id: string
): Promise<Omit<User, 'password'> | null> {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      number: true,
      sex: true,
      street: true,
      zipCode: true,
      city: true,
      state: true,
      birthDate: true,
      phone: true,
      currentWeight: true,
      password: false, // Exclude password
    },
  });
}
