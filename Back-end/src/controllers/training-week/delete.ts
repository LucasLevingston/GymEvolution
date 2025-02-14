export async function deleteTrainingWeekController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.trainingWeek.delete({
      where: { id: request.params.id },
    });
    return reply.send({ message: 'Training week deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return reply.code(404).send({ error: 'Training week not found' });
    }
    r;
  }
}
