import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestDemo1Module } from './test_demo1/test_demo1.module';
import { UserModule } from './user/user.module';
import { SpiderModule } from './spider/spider.module';

@Module({
  imports: [TestDemo1Module, UserModule, SpiderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
