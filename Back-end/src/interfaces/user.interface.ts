export interface User {
   id: string,
   email: string;
   senha: string;
}

export interface UserCreate {
   email: string
   senha: string,
}

export interface UserRepository {
   create(data: UserCreate): Promise<User>
   findByEmail(email: string): Promise<User | null>
}
