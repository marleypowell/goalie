import { TracingOptions } from '@goalie/common';
import { NatsOptions } from '@nestjs/microservices';

/**
 * The event store options.
 */
export interface EventStoreOptions {
  endpoint: string;
  connectionString: string;
}

/**
 * The configuration.
 */
export interface Config {
  port: number;
  natsOptions: NatsOptions['options'];
  eventStoreOptions: EventStoreOptions;
  tracingOptions: TracingOptions;
}
