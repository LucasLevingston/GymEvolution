import { prisma } from "../database/prisma.client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {
   async create(data: UserCreate): Promise<UserCreate> {
      const result = await prisma.user.create({
         data: {
            email: data.email,
            senha: data.senha,
            nascimento: "0"
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
   async alterarDado(email: string, field: string, novoDado: string): Promise<{ field: string, novoDado: string } | null> {
      const user = await this.findByEmail(email);
      if (!user) {
         throw new Error("Usuário não encontrado");
      }

      if (field === 'nascimento') {
         await prisma.user.update({
            where: { email },
            data: { nascimento: novoDado },
         });
         return { field, novoDado };
      }

      return null;
   }


}
export { UserRepositoryPrisma };
