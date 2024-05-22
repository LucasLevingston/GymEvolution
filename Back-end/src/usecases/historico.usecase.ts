import { Historico, HistoricoRepository } from "../interfaces/user.interface";
import { HistoricoRepositoryPrisma } from "../repositories/historico.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class HistoricoUseCase {
   private historicoRepository: HistoricoRepository;

   constructor() {
      this.historicoRepository = new HistoricoRepositoryPrisma();
   }
   async getHistorico(email: string): Promise<Historico[] | null> {
      try {
         const historico = await this.historicoRepository.getHistorico(email)
         return historico
      } catch (error) {
         throw new Error
      }
   }
}
export { HistoricoUseCase }