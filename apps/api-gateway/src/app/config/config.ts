import type { Config } from './config.interface';

/**
 * The configuration.
 */
export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  jwtConfig: {
    jwksUri: process.env.JWKS_ENDPOINT || 'http://login.mp.exclaimertest.net/oauth/v2/oauth-anonymous/jwks',
    audience: process.env.AUDIENCE || '',
    issuer: process.env.ISSUER || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-anonymous',
  },
  natsOptions: {
    servers: process.env.NATS_URL || 'nats://localhost:4222',
  },
  corsEnabled: process.env.CORS_ENABLED ? process.env.CORS_ENABLED === 'true' : true,
  trustedWebOrigins: [process.env.TRUSTED_WEB_ORIGIN || 'http://localhost:3200'],
  tracingOptions: {
    enabled: process.env.TRACING_ENABLED ? process.env.TRACING_ENABLED === 'true' : false,
    serviceName: 'api-gateway',
    consoleExporter: process.env.TRACING_CONSOLE_EXPORTER ? process.env.TRACING_CONSOLE_EXPORTER === 'true' : false,
    otelExporter: process.env.TRACING_OTEL_EXPORTER ? process.env.TRACING_OTEL_EXPORTER === 'true' : false,
  },
});
