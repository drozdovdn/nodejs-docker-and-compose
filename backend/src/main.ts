import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './config/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('Сервис КупиПодариДай')
    .setDescription('Учебный проект от Yandex Practicum')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  // Настраиваем CORS
  app.enableCors();

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      groups: ['default'],
    }),
  );
  await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();
