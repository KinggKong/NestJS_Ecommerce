import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/globalHandleException';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  const config = new DocumentBuilder()
    .setTitle('Api nest_ecommerce example')
    .setDescription('The nest_project ecommerce API description')
    .setVersion('1.0')
    .addTag('Api')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Loại bỏ các field không khai báo trong DTO
      forbidNonWhitelisted: true, // Chặn request có field không hợp lệ
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (nếu cần)
    }),
  );

  // ap dung handle exception cho project
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
