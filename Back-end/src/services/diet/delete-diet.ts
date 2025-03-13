import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function deleteDiet(id: string) {
  const diet = await prisma.diet.findUnique({
    where: { id },
  })

  if (!diet) {
    throw new ClientError('Diet not found')
  }

  // Delete the diet
  await prisma.diet.delete({
    where: { id },
  })

  // Create history entry
  await createHistoryEntry(
    diet.userId!,
    `Diet for week ${diet.weekNumber} deleted`
  )

  return true
}
