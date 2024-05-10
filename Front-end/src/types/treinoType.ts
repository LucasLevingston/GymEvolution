export interface TreinoType {
   diaDeTreino: DiaDeTreinoType[]
   semana: number,
   informacoes?: string
}

export interface DiaDeTreinoType {
   id: number,
   grupo: string,
   diaDaSemana: string,
   feito: boolean,
   observacoes?: string,
   exercicios: ExercicioType[]
}
export interface ExercicioType {
   nome: string,
   variacao?: string,
   repeticoes: number,
   quantidadeSeries: number;
   feito: boolean
   resultado?: serieType[]
}

export interface serieType {
   repeticoes?: number,
   carga?: number,
   serie?: number
}

export interface TreinoAntigoType {
   semana: number,
   treino: TreinoType,
   serie: serieType
}