import type { Config } from './config.interface';

export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3336,
  tracingOptions: {
    enabled: process.env.TRACING_ENABLED ? process.env.TRACING_ENABLED === 'true' : false,
    serviceName: 'users-service',
    consoleExporter: process.env.TRACING_CONSOLE_EXPORTER ? process.env.TRACING_CONSOLE_EXPORTER === 'true' : false,
    otelExporter: process.env.TRACING_OTEL_EXPORTER ? process.env.TRACING_OTEL_EXPORTER === 'true' : false,
  },
});
