import { User, UserCreate, UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";
export function verifyPassword(user: User, password: string) {
   return user.senha === password
}

class UserUseCase {
   private userRepository: UserRepository;

   constructor() {
      this.userRepository = new UserRepositoryPrisma();
   }

   async create({ senha, email }: UserCreate): Promise<UserCreate> {
      const verifyIfUserExists = await this.userRepository.findByEmail(email);
      if (verifyIfUserExists) {
         throw new Error("User already exists");
      }
      const result = await this.userRepository.create({ email, senha });
      return result;
   }

   async login(email: string, senha: string): Promise<User | null> {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
         throw new Error("User not found");
      }

      const isPasswordCorrect = user.senha === senha
      if (!isPasswordCorrect) {
         throw new Error("Invalid password");
      }

      return user;
   }
   async getUser(email: string): Promise<User | null> {
      const result = await this.userRepository.findByEmail(email)

      return result
   }
   async alterarDado(email: string, field: string, novoDado: string): Promise<{ field: string, novoDado: string | object } | null> {
      const user = await this.userRepository.findByEmail(email)
      if (!user) {
         throw new Error("Usuário não encontrado")
      }
      await this.userRepository.alterarDado(email, field, novoDado);
      return { field, novoDado };
   }

}

export { UserUseCase };
