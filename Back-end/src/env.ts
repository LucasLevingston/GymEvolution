import z from 'zod';
// import * as dotenv from 'dotenv';
import { resolve } from 'path';

// const envFile = process.env.NODE_ENV === 'test' ? '.testing.env' : '.env';
// dotenv.config({ path: resolve(__dirname, envFile) });

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  NODEMAILER_PASS: z.string(),
  FRONTEND_URL: z.string(),
});

export const env = {
  ...envSchema.parse(process.env),
};
