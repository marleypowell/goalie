import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NatsOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EventStoreService } from './common/event-store.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.connectMicroservice(
    {
      transport: Transport.NATS,
      options: config.get<NatsOptions['options']>('natsOptions', { infer: true }),
    },
    { inheritAppConfig: true }
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();

  const eventStoreService = app.get(EventStoreService);
  await eventStoreService.connect();

  await app.startAllMicroservices();

  const port = config.getOrThrow<number>('port', { infer: true });
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
