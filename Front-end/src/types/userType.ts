import { TreinoType, serieType } from './treinoType';
export interface UserType {
   id: number,
   nome: string,
   email: string,
   idade: string,
   pesoAtual: number,
   pesos: pesoType[],
   TreinoDaSemana?: TreinoType,
   TreinosAntigos?: {
      semana: number,
      treino: TreinoType,
      serie: serieType
   }[]
}

export interface pesoType {
   peso: number,
   data: string,
   bf: number,
}