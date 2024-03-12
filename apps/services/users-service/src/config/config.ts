import type { Config } from './config.interface';

/**
 * The configuration factory.
 */
export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3336,
  tracingOptions: {
    enabled: process.env.TRACING_ENABLED ? process.env.TRACING_ENABLED === 'true' : false,
    serviceName: 'users-service',
    consoleExporter: process.env.TRACING_CONSOLE_EXPORTER ? process.env.TRACING_CONSOLE_EXPORTER === 'true' : false,
    otelExporter: process.env.TRACING_OTEL_EXPORTER ? process.env.TRACING_OTEL_EXPORTER === 'true' : false,
  },
  accountsClientOptions: {
    clientId: process.env.ACCOUNTS_CLIENT_ID || '',
    clientSecret: process.env.ACCOUNTS_CLIENT_SECRET || '',
  },
  userManagementEndpoint:
    process.env.USER_MANAGEMENT_ENDPOINT || 'https://login.mp.exclaimertest.net/user-management/admin',
  userManagementUseGraphQL: false,
  natsOptions: {
    servers: process.env.NATS_URL || 'nats://localhost:4222',
  },
});
