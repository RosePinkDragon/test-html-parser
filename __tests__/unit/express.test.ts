import supertest from 'supertest';
import { createServer } from '@server/express';
import { HEALTH_CHECK } from '@server/config';

describe('Server', () => {
  const app = createServer();

  it('should pass', (done) => {
    supertest(app).get(HEALTH_CHECK).expect('UP', done);
  });
});
