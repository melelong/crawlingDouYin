import { Module } from '@nestjs/common';
import { TestDemo1Service } from './test_demo1.service';
import { TestDemo1Controller } from './test_demo1.controller';

@Module({
  controllers: [TestDemo1Controller],
  providers: [TestDemo1Service],
})
export class TestDemo1Module {}
