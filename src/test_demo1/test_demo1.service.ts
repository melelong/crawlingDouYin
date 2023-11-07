import { Injectable } from '@nestjs/common';

@Injectable()
export class TestDemo1Service {
  findAll() {
    return `This action returns all testDemo1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testDemo1`;
  }

  remove(id: number) {
    return `This action removes a #${id} testDemo1`;
  }
}
