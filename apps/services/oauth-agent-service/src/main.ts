import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Config } from './config/config.interface';
import { CookieEncryptionService } from './lib/cookie-encryption.service';
import { nestCsrf } from './lib/csrf.middleware';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Config>);

  const endpointsPrefix = config.get('endpointsPrefix', { infer: true });
  app.setGlobalPrefix(endpointsPrefix);


  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  app.use(cookieParser());

  const cookieEncryptionService = app.get(CookieEncryptionService);
  const cookieNamePrefix = config.get('cookieNamePrefix', { infer: true });
  app.use(nestCsrf({ cookieEncryptionService, cookieName: `${cookieNamePrefix}-csrf` }));

  setupSwagger(app);

  const port = config.get('port', { infer: true });
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${endpointsPrefix.replace(/^\//, '')}`);
}

bootstrap();
