import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new ClientError('User not found')
  }

  await prisma.user.delete({
    where: { id },
  })

  return true
}
