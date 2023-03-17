import { TracingOptions } from '@goalie/shared/goals';
import { NatsOptions } from '@nestjs/microservices';

export interface EventStoreOptions {
  endpoint: string;
  connectionString: string;
}

export interface Config {
  port: number;
  natsOptions: NatsOptions['options'];
  eventStoreOptions: EventStoreOptions;
  tracingOptions: TracingOptions;
}