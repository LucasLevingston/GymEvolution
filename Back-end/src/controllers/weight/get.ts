export async function getWeightController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const weight = await prisma.weight.findUnique({
      where: { id: request.params.id },
    });
    if (!weight) {
      return reply.code(404).send({ error: 'Weight entry not found' });
    }
    return reply.send(weight);
  } catch (error) {
    throw error;
  }
}
