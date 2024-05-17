import { Historico, Peso } from './../interfaces/user.interface';
import { prisma } from "../database/prisma.client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";
import { SemanaDeTreino } from '../interfaces/treino.interface';

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
   async getUser(email: string): Promise<User | null> {
      const user = await this.findByEmail(email)

      return user
   }
   async alterarDado(email: string, field: string, novoDado: string | Historico | Peso | SemanaDeTreino): Promise<{ field: string, novoDado: string | object } | null> {
      const user = await this.findByEmail(email);
      if (!user) {
         throw new Error("Usuário não encontrado");
      }
      if (field && novoDado) {
         if (field === 'nascimento' && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { nascimento: novoDado },
            })
         } else if (field === "sexo" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { sexo: novoDado },
            })
         } else if (field === "rua" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { rua: novoDado },
            })
         } else if (field === "numero" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { numero: novoDado },
            })
         } else if (field === "sexo" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { sexo: novoDado },
            })
         } else if (field === "rua" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { rua: novoDado },
            })
         } else if (field === "cidade" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { cidade: novoDado },
            })
         } else if (field === "estado" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { estado: novoDado },
            })
         } else if (field === "telefone" && typeof novoDado === 'string') {
            await prisma.user.update({
               where: { email },
               data: { telefone: novoDado },
            })
         } else if (field === 'peso' && typeof novoDado === 'object') {
            // Adiciona novo peso ao array de pesos antigos
            const updatedUser = await prisma.user.update({
               where: { email },
               data: {
                  pesosAntigos: {
                     create: {
                        peso: (novoDado as Peso).peso,
                        data: (novoDado as Peso).data,
                        bf: (novoDado as Peso).bf,
                     }
                  }
               },
               include: {
                  pesosAntigos: true
               }
            });

            // Atualiza o peso atual para o último peso adicionado
            await prisma.user.update({
               where: { email },
               data: {
                  pesoAtual: updatedUser.pesosAntigos[updatedUser.pesosAntigos.length - 1].peso
               },
            });

         } else if (field === "historico" && typeof novoDado === "object") {
            await prisma.user.update({
               where: { email },
               data: {
                  historico: {
                     create: novoDado as Historico
                  }
               }
            });
         }
      } else if (field === "semanaDeTreino" && typeof novoDado === 'object') {
         await prisma.user.update({
            where: { email },
            data: {
               SemanasDeTreino: {
                  create: novoDado as SemanaDeTreino
               }
            }
         });
         return { field, novoDado };
      }





      return null;
   }


}
export { UserRepositoryPrisma };
