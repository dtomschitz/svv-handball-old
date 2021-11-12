import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from '@svv/api/core/config/app';
import { AppModule } from '@svv/api/app.module';
import { join } from 'path';
import * as compression from 'compression';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
      'Accept-Language',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Observe',
    ],
  });

  app.use(compression());
  app.use(helmet());

  app.useStaticAssets(join(__dirname, '..', '..', 'images'), {
    prefix: '/images/',
  });

  app.use('/robots.txt', (_, response) => {
    response.type('text/plain');
    response.send('User-agent: *\nDisallow: /');
  });

  const appConfig: AppConfigService = app.get('AppConfigService');
  const port = appConfig.API_PORT;

  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}`);
  });
}

bootstrap();
