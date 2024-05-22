import { prisma } from "../database/prisma.client";
import { Historico, HistoricoRepository } from "../interfaces/user.interface";

class HistoricoRepositoryPrisma implements HistoricoRepository {
   async getHistorico(email: string): Promise<Historico[] | null> {
      try {
         const user = await prisma.user.findFirst({ where: { email } });
         if (!user) {
            throw new Error("Erro ao encontrar usuário");
         }
         const historico = await prisma.historico.findMany({
            where: { userId: user.id },
            include: { user: true }
         });
         return historico;
      } catch (error) {
         console.error(error);
         throw new Error("Erro ao recuperar histórico");
      }
   }
}


export { HistoricoRepositoryPrisma }