import { User } from "./user.interface";

export interface SemanaDeTreino {
   id: string;
   NumeroSemana: number;
   treino: DiaDeTreino[];
   atual: boolean;
   informacoes?: string;
   feito: boolean;
   User: User;
   userId: string;
}

export interface DiaDeTreino {
   id: string;
   grupo: string;
   diaDaSemana: string;
   feito: boolean;
   observacoes?: string;
   exercicios: Exercicio[];
   semanaDoTreino: SemanaDeTreino;
   semanaDeTreinoId: string;
}

export interface Exercicio {
   id: string;
   nome: string;
   variacao?: string;
   repeticoes: number;
   quantidadeSeries: number;
   feito: boolean;
   resultado: Serie[];
   DiaDeTreino?: DiaDeTreino;
   diaDeTreinoId?: string;
}

export interface Serie {
   id: string;
   serieIndex?: number;
   repeticoes?: number;
   carga?: number;
   Exercicio: Exercicio;
   exercicioId: string;
}

export interface SemanaDeTreinoCreate {
   informacoes?: string,
   feito: boolean,
   treino: {
      grupo: string,
      diaDaSemana: string,
      feito: boolean,
      observacoes: boolean,
      exercicios: {
         nome: string,
         variacao?: string,
         repeticoes: string,
         quantidadeDeSeries: string,
         feito: boolean
         resultado: {
            serieIndex: string,
            repeticoes: string,
            carga: string
         }[]
      }[]
   }[]
}