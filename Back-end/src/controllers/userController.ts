import { User } from '@prisma/client';
import { UserRepository } from '../interfaces/user.interface';
import { UserService } from '../services/userService';
export function verifyPassword(user: User, password: string) {
  return user.password === password;
}

class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserService();
  }

  async create(data: User): Promise<User> {
    const verifyIfUserExists = await this.userRepository.findByEmail(data.email);
    if (verifyIfUserExists) {
      throw new Error('User already exists');
    }
    const result = await this.userRepository.create(data);
    return result;
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = user.password === password;
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    return user;
  }
  async getUser(email: string): Promise<User | null> {
    const result = await this.userRepository.findByEmail(email);

    return result;
  }
  async updateUser(updatedUser: User): Promise<User | null> {
    const user = await this.userRepository.findByEmail(updatedUser.email);

    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.updateUser(updatedUser);
  }
}

export { UserController };
