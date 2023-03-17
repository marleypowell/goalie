import type { Config } from './config.interface';

export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3335,
  natsOptions: {
    servers: process.env.NATS_URL || 'nats://localhost:4222',
  },
  eventStoreOptions: {
    endpoint: process.env.EVENT_STORE_ENDPOINT || 'localhost:2113',
    connectionString: process.env.EVENT_STORE_CONNECTION_STRING || 'esdb://localhost:2113?tls=false',
  },
});
