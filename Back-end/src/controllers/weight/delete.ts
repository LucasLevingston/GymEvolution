export async function deleteWeightController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.weight.delete({
      where: { id: request.params.id },
    });
    return reply.send({ message: 'Weight entry deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return reply.code(404).send({ error: 'Weight entry not found' });
    }
    r;
  }
}
