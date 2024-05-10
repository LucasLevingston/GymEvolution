import { TreinoAntigoType, TreinoType } from './treinoType';

export interface UserType {
   id: number,
   nome: string,
   email: string,
   idade: string,
   pesoAtual: number,
   pesos: pesoType[],
   TreinoDaSemana?: TreinoType,
   TreinosAntigos?: TreinoAntigoType[]
}

export interface pesoType {
   peso: number,
   data: string,
   bf: number,
}