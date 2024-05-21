import { Historico, Peso } from './../interfaces/user.interface';
import { prisma } from "../database/prisma.client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";
import { SemanaDeTreino, SemanaDeTreinoCreate } from '../interfaces/treino.interface';

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
   async alterarDado(email: string, field: string, novoValor: string | object | Peso | SemanaDeTreinoCreate): Promise<{ field: string, novoValor: string | object } | null> {
      const user = await this.findByEmail(email);
      if (!user) {
         throw new Error("Usuário não encontrado");
      }
      if (field && novoValor) {
         if (typeof novoValor === 'string') {
            this.alterarDado(email, "historico", {
               id: user.id,
               ocorrido: `O campo '${field} foi alterado para '${novoValor}'`,
               data: Date(),
            })
            await prisma.user.update({
               where: { email },
               data: { [field]: novoValor },
            })
         } else if (field === 'peso' && typeof novoValor === 'object') {
            const updatedUser = await prisma.user.update({
               where: { email },
               data: {
                  pesosAntigos: {
                     create: {
                        peso: (novoValor as Peso).peso,
                        data: (novoValor as Peso).data,
                        bf: (novoValor as Peso).bf,
                     }
                  }
               },
               include: {
                  pesosAntigos: true
               }
            });
            this.alterarDado(email, "historico", {
               id: user.id,
               ocorrido: `O campo '${field} foi alterado para '${novoValor}'`,
               data: Date(),
               userId: user.id,
               user: user
            })
            await prisma.user.update({
               where: { email },
               data: {
                  pesoAtual: updatedUser.pesosAntigos[updatedUser.pesosAntigos.length - 1].peso
               },
            });

         } else if (field === "historico" && typeof novoValor === "object") {
            await prisma.user.update({
               where: { email },
               data: {
                  historico: {
                     create: novoValor as Historico
                  }
               }
            });
         }
      } else if (field === "semanaDeTreino" && typeof novoValor === 'object') {
         let novaSemana: SemanaDeTreino;

         if ('treino' in novoValor && Array.isArray(novoValor.treino)) {
            novaSemana = novoValor;
         } else {
            throw new Error("O tipo de dado fornecido não é válido para uma nova semana de treino");
         }
         const usuario = await prisma.user.findUnique({
            where: { email },
            include: { SemanasDeTreino: true }
         });

         if (!usuario) {
            throw new Error("Usuário não encontrado");
         }

         const novasSemanas = [...usuario.SemanasDeTreino, novaSemana];
         await prisma.user.update({
            where: { email },
            data: {
               SemanasDeTreino: {
                  create: novaSemana
               }
            }
         });
      }
      return { field, novoValor };
   }



}
export { UserRepositoryPrisma };
