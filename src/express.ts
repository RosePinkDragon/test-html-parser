import express from 'express';
import connect from './database';
import { HEALTH_CHECK, MONGO_URL } from './config';
import recipeRoutes from './routes/recipe';
import { requireUser } from './middlewares/checkAuth';

const createServer = (): express.Application => {
  const app = express();

  connect(MONGO_URL);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get(HEALTH_CHECK, (_req, res) => {
    res.send('UP');
  });

  app.use('/api', requireUser, recipeRoutes);

  return app;
};

export { createServer };
