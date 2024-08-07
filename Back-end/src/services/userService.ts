import { User, History } from '@prisma/client';
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

    if (user.name !== updatedUser.name) {
      await prisma.history.create({
        data: {
          event: `Campo nome alterado para: ${updatedUser.name}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.password !== updatedUser.password) {
      await prisma.history.create({
        data: {
          event: `Campo senha alterado.`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.sex !== updatedUser.sex) {
      await prisma.history.create({
        data: {
          event: `Campo sexo alterado para: ${updatedUser.sex}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.street !== updatedUser.street) {
      await prisma.history.create({
        data: {
          event: `Campo rua alterado para: ${updatedUser.street}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.number !== updatedUser.number) {
      await prisma.history.create({
        data: {
          event: `Campo número alterado para: ${updatedUser.number}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.zipCode !== updatedUser.zipCode) {
      await prisma.history.create({
        data: {
          event: `Campo CEP alterado para: ${updatedUser.zipCode}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.city !== updatedUser.city) {
      await prisma.history.create({
        data: {
          event: `Campo cidade alterado para: ${updatedUser.city}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.state !== updatedUser.state) {
      await prisma.history.create({
        data: {
          event: `Campo estado alterado para: ${updatedUser.state}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.birthDate !== updatedUser.birthDate) {
      await prisma.history.create({
        data: {
          event: `Campo data de nascimento alterado para: ${updatedUser.birthDate}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.phone !== updatedUser.phone) {
      await prisma.history.create({
        data: {
          event: `Campo telefone alterado para: ${updatedUser.phone}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    if (user.currentWeight !== updatedUser.currentWeight) {
      await prisma.history.create({
        data: {
          event: `Campo peso atual alterado para: ${updatedUser.currentWeight}`,
          date: Date(),
          userId: updatedUser.id,
        },
      });
    }

    // Após todos os `if`s, atualize o usuário
    const result = await prisma.user.update({
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
        email: updatedUser.email,
      },
    });

    return result;
  }
}
export { UserService };
