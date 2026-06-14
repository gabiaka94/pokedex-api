import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './middleware/request-logger';
import { errorHandler } from './middleware/error-handler';
import pokemonRoutes from './routes/pokemon.routes';
import { swaggerSpec } from './swagger';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/pokemon', pokemonRoutes);

app.use(errorHandler);

export default app;
