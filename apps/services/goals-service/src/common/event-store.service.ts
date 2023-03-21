import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { Injectable, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.interface';

@Injectable()
export class EventStoreService implements OnApplicationShutdown {
  private client: EventStoreDBClient;

  private readonly logger = new Logger(EventStoreService.name);

  public constructor(private readonly config: ConfigService<Config>) {}

  public async connect(): Promise<EventStoreDBClient> {
    try {
      this.logger.log('Connecting to EventStoreDB');
      const connectionString = this.config.get('eventStoreOptions.connectionString', { infer: true });
      this.client = EventStoreDBClient.connectionString(connectionString);

      await this.client.readAll({
        direction: FORWARDS,
        fromPosition: START,
        maxCount: 1,
      });

      return this.client;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public getClient(): EventStoreDBClient {
    return this.client;
  }

  public async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Received ${signal} signal. Disconnecting from EventStoreDB.`);
    await this.client.dispose();
  }
}

@Module({ providers: [EventStoreService], exports: [EventStoreService] })
export class EventStoreModule {}
