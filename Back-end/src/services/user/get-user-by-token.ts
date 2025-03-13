import { prisma } from 'lib/prisma';

export const getUserByToken = async (token: string) => {
  return await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });
};
