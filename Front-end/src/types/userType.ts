import { TreinoAntigoType, TreinoType } from './treinoType';

export interface UserType {
   email: string,
   senha: string,
   id: string,
   nome?: string,
   sexo?: string;
   rua?: string;
   numero?: string;
   cep?: string;
   cidade?: string;
   estado?: string;
   nascimento?: string,
   telefone?: string;
   pesoAtual?: number,
   historico?: {
      ocorrido: string;
      data: string;
   }[];
   pesos?: pesoType[],
   TreinoDaSemana?: TreinoType,
   TreinosAntigos?: TreinoAntigoType[]
}

export interface pesoType {
   peso: number,
   data: string,
   bf: number,
}