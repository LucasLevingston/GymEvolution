import fastify, { FastifyError, FastifyInstance } from 'fastify';
import { userRoutes } from './routes/user-routes';
import fastifyCors from '@fastify/cors';
import { historyRoutes } from './routes/history-routes';
import fastifySwagger from '@fastify/swagger';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { errorHandler } from 'error-handler';
import { env } from './env';

const app: FastifyInstance = fastify({ logger: false });

app.register(fastifyCors, {
  origin: '*',
});

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Gym Evolution API',
      description: 'API for Gym Evolution',
      version: '1.0.0',
    },
    tags: [{ name: 'User', description: 'User related endpoints' }],
  },
});

app.setErrorHandler(errorHandler);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, {
  prefix: '/users',
});
app.register(historyRoutes, {
  prefix: '/history',
});

app.listen({ host: 'localhost', port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${env.PORT}`);
});
