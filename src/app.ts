import express from 'express';
import { requestLogger } from './middleware/request-logger';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
