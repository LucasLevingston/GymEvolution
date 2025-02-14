import fastify, { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { userRoutes } from './routes/user-routes';
import { historyRoutes } from './routes/history-routes';
import { errorHandler } from 'error-handler';
import { env } from './env';
import { trainingWeekRoutes } from 'routes/training-week-routes';
import { weightRoutes } from 'routes/weight-routes';
import { trainingDayRoutes } from 'routes/training-day-routes';
import { exerciseRoutes } from 'routes/exercise-routes';
import { serieRoutes } from 'routes/serie-routes';
import { dietRoutes } from 'routes/diet-routes';
import { mealRoutes } from 'routes/meal-routes';
import { mealItemsRoutes } from 'routes/meal-items-routes';

const app: FastifyInstance = fastify({ logger: false });

app.register(fastifyCors, {
  origin: '*',
});

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Evolution API',
      description: 'API for Gym Evolution',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
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
app.register(trainingWeekRoutes, { prefix: '/training-weeks' });
app.register(weightRoutes, { prefix: '/weights' });
app.register(trainingDayRoutes, { prefix: '/training-days' });
app.register(exerciseRoutes, { prefix: '/exercises' });
app.register(serieRoutes, { prefix: '/series' });
app.register(dietRoutes, { prefix: '/diets' });
app.register(mealRoutes, { prefix: '/meals' });
app.register(mealItemsRoutes, { prefix: '/meal-items' });

app.listen({ host: 'localhost', port: env.PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${env.PORT}`);
});
