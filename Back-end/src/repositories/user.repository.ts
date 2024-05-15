import { prisma } from "../database/prisma.client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {
   async create(data: UserCreate): Promise<User> {
      const result = await prisma.user.create({
         data: {
            email: data.email,
            senha: data.senha,
         }
      });
      return result;
   }

   async findByEmail(email: string): Promise<User | null> {
      const result = await prisma.user.findFirst({
         where: {
            email
         }
      });
      return result || null;
   }
   async login(email: string, senha: string): Promise<User | null> {
      const user = await this.findByEmail(email)
      if (user) {
         return user.senha === senha ? user : null
      }
      return null
   }

}
export { UserRepositoryPrisma };
