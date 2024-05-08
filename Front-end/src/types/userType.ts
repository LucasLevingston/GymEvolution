export interface UserType {
   id: number,
   nome: string,
   email: string,
   idade: string,
   pesoAtual: number,
   pesos: pesoType[],
   TreinoDaSemana: TreinoType,
   TreinosAntigos: {
      semana: number,
      treino: TreinoType
      resultado: resultadoType
   }[]
}

export interface pesoType {
   peso: number,
   data: string,
   bf: number,
}

export interface TreinoType {
   diaDeTreino: DiaDeTreinoType[]
   semana: number,
   informacoes?: string
}

export interface DiaDeTreinoType {
   id: number,
   grupo: string,
   exercicios: {
      nome: string,
      variacao?: string,
      repeticoes?: number,
      series: number;
   }[]
}

export interface resultadoType {
   repeticoes: number,
   carga: number
}