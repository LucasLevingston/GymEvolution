import { Historico, Peso } from './../interfaces/user.interface';
import { prisma } from '../database/prisma.client';
import { User, UserCreate, UserRepository } from '../interfaces/user.interface';
import { SemanaDeTreino, SemanaDeTreinoCreate } from '../interfaces/treino.interface';

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<UserCreate> {
    const result = await prisma.user.create({
      data: {
        email: data.email,
        senha: data.senha,
        nascimento: '0',
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
  async login(email: string, senha: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user) {
      return user.senha === senha ? user : null;
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
  //  async alterarDado(email: string, field: string, novoValor: string | object | Peso | SemanaDeTreinoCreate): Promise<{ field: string, novoValor: string | object } | null> {
  //     const user = await this.findByEmail(email);
  //     if (!user || !field || !novoValor) {
  //        throw new Error("Usuário não encontrado");
  //     }

  //     if (typeof novoValor === 'string') {
  //        await prisma.user.update({
  //           where: { email },
  //           data: { [field]: novoValor },
  //        })
  //        await prisma.historico.create({
  //           data: {
  //              userId: user.id,
  //              ocorrido: `O campo '${field}' foi alterado para '${novoValor}'`,
  //              data: new Date().toISOString(),
  //           }
  //        });
  //        return { field, novoValor }
  //     }

  //     else if (field === 'peso' && typeof novoValor === 'object') {
  //        const updatedUser = await prisma.user.update({
  //           where: { email },
  //           data: {
  //              pesosAntigos: {
  //                 create: {
  //                    peso: (novoValor as Peso).peso,
  //                    data: (novoValor as Peso).data,
  //                    bf: (novoValor as Peso).bf,
  //                 }
  //              }
  //           },
  //           include: {
  //              pesosAntigos: true
  //           }
  //        });
  //        await prisma.historico.create({
  //           data: {
  //              userId: user.id,
  //              ocorrido: `O '${field}' foi alterado para '${novoValor}'`,
  //              data: new Date().toISOString(),
  //           }
  //        });
  //        await prisma.user.update({
  //           where: { email },
  //           data: {
  //              pesoAtual: updatedUser.pesosAntigos[updatedUser.pesosAntigos.length - 1].peso
  //           },
  //        });

  //     }
  //     if (field === "semanaDeTreino" && typeof novoValor === 'object') {
  //        let novaSemana: SemanaDeTreino;

  //        if ('treino' in novoValor && Array.isArray(novoValor.treino)) {
  //           novaSemana = novoValor;
  //        } else {
  //           throw new Error("O tipo de dado fornecido não é válido para uma nova semana de treino");
  //        }
  //        const usuario = await prisma.user.findUnique({
  //           where: { email },
  //           include: { SemanasDeTreino: true }
  //        });

  //        if (!usuario) {
  //           throw new Error("Usuário não encontrado");
  //        }

  //        const novasSemanas = [...usuario.SemanasDeTreino, novaSemana];
  //        await prisma.user.update({
  //           where: { email },
  //           data: {
  //              SemanasDeTreino: {
  //                 create: novaSemana
  //              }
  //           }
  //        });
  //     }
  //     return { field, novoValor };
  //  }
  async alterarDado(updatedData: User): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: updatedData.email,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Mapeie a array de histórico atualizada para o formato esperado pelo Prisma
      const historicoUpdateInputs = updatedData.historico.map((historicoItem) => ({
        where: { id: historicoItem.id }, // Você precisa fornecer uma chave única para cada item de histórico
        data: { ...historicoItem }, // Espalha as propriedades do item de histórico
      }));

      const result = await prisma.user.update({
        where: {
          email: updatedData.email,
        },
        data: {
          ...updatedData,
          historico: {
            // Use 'updateMany' para atualizar vários registros de histórico
            updateMany: historicoUpdateInputs,
          },
        },
      });

      return result;
    } catch (error) {
      throw new Error('Fail');
    }
  }
}
export { UserRepositoryPrisma };
