import { NestFactory } from '@nestjs/core';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启版本控制
  app.enableVersioning({
    // 设置版本类型
    type: VersioningType.URI,
    // 默认可以默认版本、v1、v2访问
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
  });
  // 开启接口文档
  const config = new DocumentBuilder()
    .setTitle('Test example') // 标题
    .setDescription('The API description') // 描述
    .setVersion('1.0') // 版本
    .addTag('test') // 添加标签
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // /doc 访问文档
  SwaggerModule.setup('doc', app, document);
  // 使用session中间件
  app.use(
    session({
      secret: 'melelong',
      name: 'melelong.session',
      rolling: true,
      cookie: {
        maxAge: null,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
