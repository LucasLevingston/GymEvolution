export async function createWeightController(
  request: FastifyRequest<{
    Body: { weight: string; date: string; bf: string; userId: string };
  }>,
  reply: FastifyReply
) {
  try {
    const weight = await prisma.weight.create({
      data: request.body,
    });
    return reply.code(201).send(weight);
  } catch (error) {
    throw error;
  }
}
