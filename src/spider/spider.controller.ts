/*
 * 2023-10-29 21:35:15
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
import { Controller, Get, Query } from '@nestjs/common';
import { SpiderService } from './spider.service';
@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}
  @Get('run')
  async spider(
    @Query('userId')
    userId: string = 'MS4wLjABAAAAEhkX6zQmo7hKuPD6zDA5M3igXQotYGr3z01oUMT4uR4',
    @Query('type') type: string = 'default',
    @Query('path') path?: string,
    @Query('url') url?: string,
  ) {
    try {
      const data = await this.spiderService.run(userId, path, url);
      type === 'download' && this.spiderService.downLoadMp4(data);
      await this.spiderService.writeJson(data, userId);
      return {
        code: 200,
        msg: '成功',
        size: data.length,
        data,
      };
    } catch (err) {
      return {
        code: 500,
        msg: err.message,
      };
    }
  }
}
