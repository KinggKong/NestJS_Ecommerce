import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/globalHandleException';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //config to use swagger
  const config = new DocumentBuilder()
    .setTitle('Api nest_ecommerce example')
    .setDescription('The nest_project ecommerce API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);


  //config to use validate pipes global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Loại bỏ các field không khai báo trong DTO
    forbidNonWhitelisted: true, // Chặn request có field không hợp lệ
    transform: true,  // Tự động chuyển đổi kiểu dữ liệu (nếu cần)
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
