import { History } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import { FastifyRequest } from 'fastify';
import { getHistory } from 'services/history/get';

export async function getHistoryController(
  request: FastifyRequest<{ Params: { id: string } }>
): Promise<History[] | null> {
  const { id } = request.params;

  try {
    const h = await getHistory(id);
    return h;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
