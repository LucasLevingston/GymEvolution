import { User, UserCreate, UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
   private userRepository: UserRepository;

   constructor() {
      this.userRepository = new UserRepositoryPrisma();
   }

   async create({ senha, email }: UserCreate): Promise<User> {
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

      // const isPasswordCorrect = await this.userRepository.verifyPassword(user.id, password);
      // if (!isPasswordCorrect) {
      //    throw new Error("Invalid password");
      // }

      return user;
   }
}

export { UserUseCase };
