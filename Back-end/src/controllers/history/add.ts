import { FastifyRequest } from 'fastify';
import { addToHistory } from 'services/history/add';
import { getUserByIdService } from 'services/user/get-by-id';

export async function addToHistoryController(
  request: FastifyRequest<{
    Body: {
      history: {
        event: string;
        date: string;
        userId: string;
      };
    };
  }>
) {
  const { history } = request.body;

  const user = await getUserByIdService(history.userId);

  if (!user) return null;

  return addToHistory({ ...history, ...user });
}
