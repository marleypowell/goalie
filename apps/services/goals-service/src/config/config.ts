import type { Config } from './config.interface';

/**
 * The configuration.
 */
export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3335,
  natsOptions: {
    servers: process.env.NATS_URL || 'nats://localhost:4222',
  },
  eventStoreOptions: {
    endpoint: process.env.EVENT_STORE_ENDPOINT || 'localhost:2113',
    connectionString: process.env.EVENT_STORE_CONNECTION_STRING || 'esdb://localhost:2113?tls=false',
  },
  tracingOptions: {
    enabled: process.env.TRACING_ENABLED ? process.env.TRACING_ENABLED === 'true' : false,
    serviceName: 'goals-service',
    consoleExporter: process.env.TRACING_CONSOLE_EXPORTER ? process.env.TRACING_CONSOLE_EXPORTER === 'true' : false,
    otelExporter: process.env.TRACING_OTEL_EXPORTER ? process.env.TRACING_OTEL_EXPORTER === 'true' : false,
  },
});
