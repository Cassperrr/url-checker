import { Logger, ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { getConfigValue, schema } from './config';
import { swaggerSetup } from './docs';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
    { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
  );

  const config = app.get(ConfigService<schema, true>);
  const port = getConfigValue(config, 'APP_PORT');
  const host = getConfigValue(config, 'APP_HOST');
  const origin = getConfigValue(config, 'CORS_ORIGINS');

  app.setGlobalPrefix('api');

  app.enableCors({
    origin,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);

  swaggerSetup(app);
  await app.listen(port, host, () => {
    const logger = new Logger('Bootstrap');
    logger.log(`App run on :${port}`);
  });
}
void bootstrap();
