import { FastifyInstance } from "fastify"
import { HistoricoUseCase } from "../usecases/historico.usecase"
import { UserUseCase } from "../usecases/user.usercase"

export async function historicoRoutes(fastify: FastifyInstance) {
   const historicoUseCase = new HistoricoUseCase()
   fastify.get('/:email', async (req, reply) => {
      const params = req.params;
      if (typeof params === "object" && params && "email" in params) {
         const email = params.email;
         try {
            const result = await historicoUseCase.getHistorico(String(email))
            reply.send(result)
         } catch (error) {
            reply.send(error)
         }
      }
   })
}