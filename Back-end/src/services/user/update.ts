import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function updateUserService(updatedUser: User) {
  const result = await prisma.user.update({
    where: { id: updatedUser.id },
    data: {
      name: updatedUser.name,
      sex: updatedUser.sex,
      street: updatedUser.street,
      number: updatedUser.number,
      zipCode: updatedUser.zipCode,
      city: updatedUser.city,
      state: updatedUser.state,
      birthDate: updatedUser.birthDate,
      phone: updatedUser.phone,
      currentWeight: updatedUser.currentWeight,
      email: updatedUser.email,
      password: updatedUser.password,
    },
  });

  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
}
