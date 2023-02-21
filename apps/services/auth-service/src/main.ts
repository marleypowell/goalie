import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
      },
    }
  );
  await app.listen();
}

bootstrap();
