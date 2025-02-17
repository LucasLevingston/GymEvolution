import { hashPassword } from 'utils/auth';
import { prisma } from 'utils/prisma';

export async function resetPasswordService(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired password reset token');
  }

  const hashedPassword = await hashPassword(newPassword);

  return await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
}
