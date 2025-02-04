import { prisma } from 'utils/prisma';

export async function deleteUserService(id: string): Promise<{}> {
  return await prisma.user.delete({ where: { id } });
}
