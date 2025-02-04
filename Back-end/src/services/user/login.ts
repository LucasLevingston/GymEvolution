import { User } from '@prisma/client';
import { getUserByEmailService } from './get-by-email';

export async function loginService(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmailService(email);

  if (!user) return null;

  return user.password === password ? user : null;
}
