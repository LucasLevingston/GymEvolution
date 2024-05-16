import { UserType } from "./userType";

export interface SemanaDeTreinoType {
   id: string;
   NumeroSemana: number;
   treino: DiaDeTreinoType[];
   atual: boolean;
   informacoes?: string;
   feito: boolean;
   User: UserType;
   userId: string;
}

export interface DiaDeTreinoType {
   id: string;
   grupo: string;
   diaDaSemana: string;
   feito: boolean;
   observacoes?: string;
   exercicios: ExercicioType[];
   semanaDoTreino: SemanaDeTreinoType;
   semanaDeTreinoId: string;
}

export interface ExercicioType {
   id: string;
   nome: string;
   variacao?: string;
   repeticoes: number;
   quantidadeSeries: number;
   feito: boolean;
   resultado: SerieType[];
   DiaDeTreino?: DiaDeTreinoType;
   diaDeTreinoId?: string;
}

export interface SerieType {
   id: string;
   serieIndex?: number;
   repeticoes?: number;
   carga?: number;
   Exercicio: ExercicioType;
   exercicioId: string;
}