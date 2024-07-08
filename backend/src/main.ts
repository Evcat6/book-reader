import path from 'node:path';

import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { APP_GLOBAL_PREFIX } from './common/constant';

function setupDocumentation(app: INestApplication): void {
  const documentConfig = new DocumentBuilder()
    .setTitle('Book Reader API')
    .setDescription('Book Reader API - list of available endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('docs', app, document);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(APP_GLOBAL_PREFIX);

  app.enableCors({ origin: '*' });

  app.useStaticAssets(path.join(__dirname, 'uploads'), { prefix: '/uploads' });

  setupDocumentation(app);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_HOST],
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);

  const logger = new Logger('NestApplication');

  logger.log(`Server running on port ${process.env.PORT}`);
}

void bootstrap();
