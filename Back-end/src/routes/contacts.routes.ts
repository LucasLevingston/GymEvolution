import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usercase";
import { UserCreate } from "../interfaces/user.interface";
import { ContactUseCase } from "../usecases/contact.usecase";
import { ContactCreate } from "../interfaces/contact.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function contactsRoutes(fastify: FastifyInstance) {
   const contactUseCase = new ContactUseCase()
   fastify.addHook('preHandler', authMiddleware)
   fastify.post<{ Body: ContactCreate }>('/', async (req, reply) => {
      const { name, email, phone } = req.body
      const { userEmail, } = req.headers
      try {
         const data = await contactUseCase.create({
            email, name, phone, userEmail
         })

         return reply.send(data)
      } catch (error) {
         reply.send(error)
      }
   })
}