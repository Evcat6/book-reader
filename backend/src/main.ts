import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { APP_GLOBAL_PREFIX } from './common/constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

function setupDocs(app: INestApplication) {
  const docConfig = new DocumentBuilder()
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
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);

  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(APP_GLOBAL_PREFIX);

  app.enableCors({ origin: '*' });

  app.useStaticAssets(join(__dirname, 'uploads'), { prefix: '/uploads' });

  setupDocs(app);

  await app.listen(process.env.PORT);

  const logger = new Logger('NestApplication');

  logger.log(`Server running on port ${process.env.PORT}`);
}
bootstrap();
