import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  NODEMAILER_PASS: z.string(),
  FRONTEND_URL: z.string(),
  HOST: z.string(),
})

export const env = {
  ...envSchema.parse(process.env),
}
