import { setupTracing } from '@goalie/common';
import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CookieEncryptionService } from './lib/cookie-encryption.service';
import { nestCsrf } from './lib/csrf.middleware';
import { setupSwagger } from './swagger';

/**
 * The bootstrap function. It is used to bootstrap the application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  const config = app.get(ConfigService);

  const endpointsPrefix = config.get<string>('endpointsPrefix', { infer: true });
  app.setGlobalPrefix(endpointsPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  if (config.get<boolean>('corsEnabled', { infer: true })) {
    app.enableCors({
      origin: config.get<string[]>('trustedWebOrigins', { infer: true }),
      credentials: true,
    });
  }

  app.use(cookieParser());

  const cookieEncryptionService = app.get(CookieEncryptionService);
  const cookieNamePrefix = config.get<string>('cookieNamePrefix', { infer: true });
  app.use(nestCsrf({ cookieEncryptionService, cookieName: `${cookieNamePrefix}-csrf` }));

  setupSwagger(app);
  setupTracing(app);

  app.enableShutdownHooks();

  const port = config.getOrThrow<number>('port', { infer: true });
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}${endpointsPrefix}`);
}

bootstrap();
