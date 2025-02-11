import { User } from '@prisma/client';
import { getUserByIdService } from './get-by-id';

export async function loginService(email: string) {
  return await getUserByIdService(email);
}
