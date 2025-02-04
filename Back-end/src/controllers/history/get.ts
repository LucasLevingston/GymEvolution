import { History } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { getHistory } from 'services/history/get';

export async function getHistoryController(
  request: FastifyRequest<{ Params: { id: string } }>
): Promise<History[] | null> {
  const { id } = request.params;

  try {
    return await getHistory(id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve history');
  }
}
