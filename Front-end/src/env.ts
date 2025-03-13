import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(import.meta.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Error validating environment variables:', error.errors);
    throw new Error('Invalid configuration. Please check the environment variables.');
  }
  throw error;
}

export { env };
