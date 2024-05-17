import { SemanaDeTreino, } from "./treino.interface";

export interface User {
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
   pesoAtual?: string;
   historico: Historico[];
   pesosAntigos: Peso[];
   SemanasDeTreino: SemanaDeTreino[];
}

export interface Historico {
   id: string;
   ocorrido: string;
   data: string;
   userId: string;
   user: User;
}

export interface Peso {
   id: string;
   peso: string;
   data: string;
   bf: string;
   userId: string;
   user: User;
}

export interface UserCreate {
   email: string
   senha: string,
}

export interface UserRepository {
   create(data: UserCreate): Promise<UserCreate>
   findByEmail(email: string): Promise<User | null>
   getUser(email: string): Promise<User | null>
   login(email: string, senha: string): Promise<User | null>
   alterarDado(email: string, field: string, novoDado: string): Promise<{ field: string, novoDado: string | object } | null>
}
