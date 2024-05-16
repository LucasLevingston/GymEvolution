import { SemanaDeTreinoType } from "./treinoType";

export interface UserType {
   id: string;
   email: string;
   senha: string;
   nome?: string;
   sexo?: string;
   rua?: string;
   numero?: string;
   cep?: string;
   cidade?: string;
   estado?: string;
   nascimento?: string;
   telefone?: string;
   pesoAtual?: number;
   historico: Historico[];
   pesosAntigos: Peso[];
   SemanasDeTreino: SemanaDeTreinoType[];
}

export interface Historico {
   id: string;
   ocorrido: string;
   data: string;
   userId: string;
   user: UserType;
}

export interface Peso {
   id: string;
   peso: number;
   data: string;
   bf: number;
   userId: string;
   user: UserType;
}