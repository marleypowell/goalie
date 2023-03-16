import { Transport } from '@nestjs/microservices';
import type { Config } from './config.interface';

export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3333,
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
  corsEnabled: process.env.CORS_ENABLED ? process.env.CORS_ENABLED === 'true' : true,
  trustedWebOrigins: [process.env.TRUSTED_WEB_ORIGIN || 'http://localhost:3200'],
});
