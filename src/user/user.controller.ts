import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as svgCaptcha from 'svg-captcha';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('code')
  createCaptcha(@Req() req: any, @Res() res: any) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    });
    req.session.code = captcha.text;
    res.type('svg');
    res.send(captcha.data);
  }
  @Post('create')
  create(@Body() body: any, @Req() req: any) {
    const isTrue = req.session.code.toLowerCase() === body?.code?.toLowerCase();
    const res = {
      code: isTrue ? 200 : 500,
      msg: isTrue ? '验证码正确' : '验证码错误',
    };
    return isTrue ? { ...res, name: body.name } : res;
  }
}
