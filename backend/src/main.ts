import 'reflect-metadata';
import 'es6-shim';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './common/filter/all-exception.filter';
import appConfig from './common/config/app-conf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);

  const PORT: number = nestApp.get(ConfigService).get<ConfigType<typeof appConfig>>('appConfig')?.app.port;

  const VERSION_PREFIX: string = nestApp.get(ConfigService).get<ConfigType<typeof appConfig>>('appConfig')?.app.version;
  nestApp.setGlobalPrefix(VERSION_PREFIX);
  nestApp.enableVersioning({
    type: VersioningType.URI,
  });

  const httpAdapter = nestApp.get(HttpAdapterHost);
  nestApp.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerDocConfig = new DocumentBuilder()
    .setTitle('FeedApp REST API')
    .setDescription('OpenAPI doc for FeedApp REST API')
    .setVersion(VERSION_PREFIX)
    .setExternalDoc('OpenAPI', '/docs')
    .addTag('FeedApp')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(nestApp, swaggerDocConfig);
  SwaggerModule.setup('docs', nestApp, document);

  nestApp.enableCors();

  await nestApp.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => nestApp.close());
  }
}

bootstrap();
