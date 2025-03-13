import { prisma } from 'lib/prisma';

export async function passwordRecoverService(
  email: string,
  token: string,
  expirationDate: Date
) {
  return await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expirationDate,
    },
  });
}
