import { setupTracing } from '@goalie/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NatsOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  const config = app.get(ConfigService);

  app.connectMicroservice(
    {
      transport: Transport.NATS,
      options: config.get<NatsOptions['options']>('natsOptions', { infer: true }),
    },
    { inheritAppConfig: true }
  );

  setupTracing(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();

  await app.startAllMicroservices();

  const port = config.getOrThrow<number>('port', { infer: true });
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
