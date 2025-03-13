import { prisma } from 'lib/prisma';

export async function getUserByEmailService(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}
