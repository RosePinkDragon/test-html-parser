import moduleAlias from 'module-alias';
import { createServer } from '@server/express';
import { AddressInfo } from 'net';
import http from 'http';
import { logger } from '@server/logger';
import { NODE_ENV, PORT } from './config';

const sourcePath = NODE_ENV === 'development' ? 'src' : 'build';
moduleAlias.addAliases({
  '@server': sourcePath,
  '@config': `${sourcePath}/config`,
  '@domain': `${sourcePath}/domain`,
});

const port = PORT || '5000';

async function startServer() {
  const app = createServer();
  const server = http.createServer(app).listen({ port }, () => {
    const addressInfo = server.address() as AddressInfo;
    logger.info(`Server ready at ${addressInfo.port}`);
  });

  const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signalTraps.forEach((type) => {
    process.once(type, async () => {
      logger.info(`process.once ${type}`);

      server.close(() => {
        logger.debug('HTTP server closed');
      });
    });
  });
}

startServer();
