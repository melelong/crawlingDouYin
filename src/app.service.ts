import { Injectable } from '@nestjs/common';
// @Injectable() 装饰器来标记该类为可注入的服务
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
