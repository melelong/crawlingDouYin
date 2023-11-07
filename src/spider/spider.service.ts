import { Injectable } from '@nestjs/common';
import { getRandomNum, sleep } from './utils';
import puppeteer from 'puppeteer';
import { writeFileSync, existsSync, mkdirSync, createWriteStream } from 'fs';
import axios from 'axios';
@Injectable()
export class SpiderService {
  name: string;
  // 浏览器中的处理逻辑
  // 检查中间页验证
  async middlePage() {
    const sleep = (delay: any) =>
      new Promise((resolve) => setTimeout(resolve, delay));
    let isCenter: boolean = true;
    let info: string;
    while (isCenter) {
      const dom: HTMLElement | null =
        document.querySelector('.y4Jb5f1C.GSBPs9bN')!;
      info = !dom ? '有中间页验证' : '没有中间页验证';
      console.log(info);
      isCenter = !dom;
      await sleep(500);
    }
  }
  // 清理登录验证
  cleanLogin() {
    if (document.querySelector('#login-pannel')) {
      const a: HTMLElement = document.querySelector('.dy-account-close');
      console.log('有登录验证');
      a.click();
      console.log('清理登录验证成功');
    }
  }
  // 清理滚动验证
  async cleanScrolling() {
    const sleep = (delay: any) =>
      new Promise((resolve) => setTimeout(resolve, delay));
    const a: HTMLElement = document.querySelector('.captcha_verify_container');
    if (a?.style?.display === 'block') {
      const b: HTMLElement = document.querySelector('.verify-bar-close');
      console.log('有滚动验证');
      await sleep(3000);
      b.click();
      window.scrollBy(0, -500);
      console.log('清理滚动验证成功');
    }
  }
  // 滚动页面加载数据
  async scrollingPage() {
    const dom = document.querySelector('.WltbFpmM');
    !!dom && dom?.scrollIntoView({ behavior: 'smooth' });
  }
  // 没有中间页验证处理
  async handel2() {
    console.log(1);
  }
  // 判断加载完没有
  isLoading() {
    const dom = document.querySelector('.Bllv0dx6');
    if (!dom) return true;
    return dom.innerHTML;
  }
  // 获取名字和ID
  getNameAndId() {
    const dom1 = document.querySelector('.Nu66P_ba');
    const dom2 = document.querySelector('.aH7rLkZZ');
    const text1 = dom1.innerHTML.replace(/<\/?[^>]+(>|$)/g, '');
    const text2 = dom2.innerHTML.replace(/<!--(.*?)-->/g, '');
    return `${text1}（${text2}）`;
  }
  // 处理无法获取数据
  handelError() {
    const span: HTMLElement = document.querySelector('.Bllv0dx6 > span');
    span.click();
    console.log('无法获取数据');
  }

  // node逻辑
  // 创建浏览器
  async _createBrowser(path?: string) {
    const config = path
      ? {
          headless: false,
          defaultViewport: null,
          args: ['--start-maximized'],
          executablePath: path,
        }
      : {
          headless: false,
          defaultViewport: null,
          args: ['--start-maximized'],
        };
    const browser = await puppeteer.launch(config);
    const page = await browser.newPage();
    // 修改请求头
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      'Sec-Ch-Ua':
        'Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
    });
    return {
      page,
      browser,
    };
  }
  // 截图全屏
  async _screenshot(page: any, name: string) {
    console.log('截图全屏中...');
    await sleep(getRandomNum(1000, 2500));
    await page.screenshot({ path: `./res/img/${name}.png`, fullPage: true });
    console.log('截图全屏成功');
  }
  // 处理res
  async handelRes(response: any) {
    try {
      const postUrl: string = 'https://www.douyin.com/aweme/v1/web/aweme/post/';
      const url = await response.url();
      const method = await response.request().method();
      if (method !== 'GET') return;
      if (!url.startsWith(postUrl)) return;
      const text = await response.text();
      return text;
    } catch (e) {
      return e;
    }
  }
  async goToPage(url: string, userId: string, path?: string) {
    const res: any[] = [];
    let isLoading: string | boolean = true;
    const { page, browser } = await this._createBrowser(path);
    const handelResponse = async (response) => {
      const body = await this.handelRes(response);
      typeof body === 'string' && body.startsWith('{') && res.push(body);
    };
    page.on('response', handelResponse);
    await page.goto(url);
    await sleep(getRandomNum(3000, 4000));
    await page.goto(`${url}/user/${userId}`);
    await sleep(getRandomNum(4000, 5000));

    try {
      // 没有中间页处理
      await page.evaluate(this.middlePage);
      await sleep(getRandomNum(1000, 1500));
      while (isLoading !== '暂时没有更多了') {
        isLoading = await page.evaluate(this.isLoading);
        await page.evaluate(this.cleanLogin);
        await page.evaluate(this.cleanScrolling);
        await page.evaluate(this.scrollingPage);
        await sleep(getRandomNum(1500, 2000));
        if (isLoading === '暂时没有更多了') {
          page.off('response', handelResponse);
          this.name = await page.evaluate(this.getNameAndId);
          await this._screenshot(page, this.name);
        } else if (isLoading !== '暂时没有更多了' && isLoading !== true)
          await page.evaluate(this.handelError);
      }
    } catch (e) {
      // 有中间页处理
      await sleep(getRandomNum(3000, 4000));
      while (isLoading !== '暂时没有更多了') {
        isLoading = await page.evaluate(this.isLoading);
        await page.evaluate(this.cleanLogin);
        await page.evaluate(this.cleanScrolling);
        await page.evaluate(this.scrollingPage);
        await sleep(getRandomNum(1500, 2000));
        if (isLoading === '暂时没有更多了') {
          page.off('response', handelResponse);
          this.name = await page.evaluate(this.getNameAndId);
          await this._screenshot(page, this.name);
        } else if (isLoading !== '暂时没有更多了' && isLoading !== true) {
          await page.evaluate(this.handelError);
        }
      }
    }
    await browser.close();
    return res;
  }
  async run(userId: string, path?: string, url?: string) {
    url = url || 'https://www.douyin.com';
    const res = await this.goToPage(url, userId, path);
    const newRes = res.map((e) => {
      const json = JSON.parse(e);
      return json['aweme_list'];
    });
    console.log('爬取完毕');
    return newRes
      .flat(Infinity)
      .map((e) => e['video']['play_addr']['url_list'][1]);
  }
  async writeJson(res: string[], userId: string) {
    console.log('数据写入json中...');
    try {
      writeFileSync(
        `./res/json/${this.name}.json`,
        JSON.stringify(
          {
            userId,
            num: res.length,
            path: res,
          },
          null,
          2,
        ),
        'utf8',
      );
      console.log('数据写入json成功');
    } catch (e) {
      console.log(e);
      console.log('数据写入json失败');
    }
  }
  async downLoadMp4(res: string[]) {
    console.log('下载视频中...');
    const dir = `./res/mp4/${this.name}`;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const promises = res.map(async (path, index) => {
      try {
        const response = await axios.get(path, { responseType: 'stream' });
        const filepath = `${dir}/${this.name}(${index}).mp4`;

        // 将响应流写入文件
        const writer = createWriteStream(filepath);
        response.data.pipe(writer);

        // 返回 Promise 以便异步处理
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      } catch (error) {
        console.error(`下载 ${path} 失败:`, error);
      }
    });
    await Promise.all(promises);
    console.log('所有视频下载完成');
  }
}
