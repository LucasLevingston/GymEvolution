import fastify, { FastifyError, FastifyInstance } from 'fastify';
import { userRoutes } from './routes/user-routes';
import fastifyCors from '@fastify/cors';
import { historyRoutes } from './routes/history-routes';

const app: FastifyInstance = fastify({ logger: false });

app.register(fastifyCors, {
  origin: '*',
});

app.register(userRoutes, {
  prefix: '/users',
});
app.register(historyRoutes, {
  prefix: '/historico',
});

app.listen({ host: 'localhost', port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
