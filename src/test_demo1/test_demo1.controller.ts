/*
 * 2023-10-29 16:06:27
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Query,
  Headers,
  Header,
  HostParam,
  Response,
  Next,
  Ip,
} from '@nestjs/common';
import { TestDemo1Service } from './test_demo1.service';
import { NextFunction } from 'express';

@Controller({
  path: 'testDemo1',
  host: ':host',
})
export class TestDemo1Controller {
  constructor(private readonly testDemo1Service: TestDemo1Service) {}
  @Get('next')
  next1(@Next() next: NextFunction) {
    console.log('next1');
    next();
    return 'next1';
  }
  @Get('next')
  next2(@Ip() ip: string) {
    console.log(`next2处理`);
    console.log(ip);
    return {
      code: 200,
      ip,
    };
  }

  @Get('res')
  res(@Response({ passthrough: true }) res: any) {
    console.log(res);
    // 有Response装饰器的情况下，默认需要手动返回对象，配置passthrough: true，自动返回
    // res.send({
    //   code: 200,
    // });
    return {
      code: 200,
    };
  }
  @Get('host')
  host(@HostParam('host') host: any) {
    return {
      code: 200,
      host,
    };
  }
  @Get('headers')
  @Header('aaa', '123')
  header(@Headers('token') token: string) {
    return {
      code: 200,
      token,
    };
  }
  @Get('query')
  query(@Query('age') age: string) {
    console.log(age);
    return {
      code: 200,
      age: +age,
    };
  }

  @Get('req:num')
  req(@Request() req: any) {
    console.log(req);
    return {
      code: 200,
      body: req.body,
      query: req.query,
      param: req.param('num'),
    };
  }
  @Get(':id')
  param(@Param('id') id: string) {
    return {
      code: 200,
      id,
    };
  }

  @Post('body')
  @HttpCode(403)
  body(@Body() body: { name: string; age: number; sex: string }) {
    return {
      code: 200,
      ...body,
    };
  }
}
