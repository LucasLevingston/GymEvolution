import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../env';
import { ClientError } from '../errors/client-error';

const { JWT_SECRET_KEY } = env;

if (!JWT_SECRET_KEY) {
  throw new ClientError('Not secret key');
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '10h' });
};

export const verifyToken = (token: string): string | JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    throw new ClientError('Invalid token');
  }
};
