import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usercase";
import { User, UserCreate } from "../interfaces/user.interface";

export async function userRoutes(fastify: FastifyInstance) {
   const userUseCase = new UserUseCase()
   fastify.post<{ Body: UserCreate }>('/', async (req, reply) => {
      const { senha, email } = req.body
      try {
         const data = await userUseCase.create({ senha, email })

         return reply.send(data)
      } catch (error) {
         reply.send(error)
      }
   })
   fastify.post<{
      Body: { email: string; senha: string };
   }>('/login', async (req, reply) => {
      const { email, senha } = req.body;
      try {
         const data = await userUseCase.login(email, senha);
         return reply.send(data);
      } catch (error) {
         reply.send(error);
      }
   });
}