import { User } from '@prisma/client';
import { prisma } from '../database/prisma.client';
import { UserRepository } from '../interfaces/user.interface';

class UserService implements UserRepository {
  async create(data: User): Promise<User> {
    const result = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    return result || null;
  }
  async login(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user) {
      return user.password === password ? user : null;
    }
    return null;
  }
  async getUser(email: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    return user;
  }
  // async adicionarAoHistorico(email: string, field: string, novoValor: string | object) {
  //    const user = await this.findByEmail(email);
  //    try {
  //       if (!user) {
  //          throw new Error("Usuário não encontrado");
  //       }
  //       await prisma.user.update({
  //          where: { email },
  //          data: {
  //             historico: {
  //                create: {
  //                   id: user.id,
  //                   ocorrido: `O campo '${field} foi alterado para '${novoValor}'`,
  //                   data: Date(),
  //                }
  //             }
  //          }
  //       }
  //       )
  //    } catch (error) {
  //       throw new Error("Erro ao cadastrar no historico")
  //    }
  // }
  async updateUser(updatedUser: User): Promise<User | null> {
    const user = await this.findByEmail(updatedUser.email);

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.user.update({
      where: { email: updatedUser.email },
      data: {
        name: updatedUser.name,
        password: updatedUser.password,
        sex: updatedUser.sex,
        street: updatedUser.street,
        number: updatedUser.number,
        zipCode: updatedUser.zipCode,
        city: updatedUser.city,
        state: updatedUser.state,
        birthDate: updatedUser.birthDate,
        phone: updatedUser.phone,
        currentWeight: updatedUser.currentWeight,
        // // relacionamentos se necessário
        // history: {
        //   set: updatedUser.history || [], // Use `set` para relacionar ou atualizar dados
        // },
        // oldWeights: {
        //   set: updatedUser.oldWeights || [],
        // },
        // TrainingWeeks: {
        //   set: updatedUser.TrainingWeeks || [],
        // },
      },
    });
  }
}
export { UserService };
