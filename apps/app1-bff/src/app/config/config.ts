import { Transport } from '@nestjs/microservices';
import type { Config } from './config.interface';

export default (): Config => ({
  jwtConfig: {
    jwksUri: process.env.JWKS_ENDPOINT || 'http://login.mp.exclaimertest.net/oauth/v2/oauth-anonymous/jwks',
    audience: process.env.AUDIENCE || '',
    issuer: process.env.ISSUER || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-anonymous',
  },
  goalsServiceOptions: {
    transport: Transport.NATS,
    options: {
      url: process.env.NATS_URL || 'nats://localhost:4222',
    },
  },
});
