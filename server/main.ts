import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { configureApp } from '@lark-apaas/fullstack-nestjs-core';
import { join } from 'path';
import { __express as hbsExpressEngine } from 'hbs';
import express from 'express';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: process.env.NODE_ENV !== 'development',
  });
  await configureApp(app, { 
    disableSwagger: true,
  });
  const logger = new Logger('Bootstrap');
  // 平台约定：Vercel 等 PaaS 通过 PORT 注入监听端口，且需监听 0.0.0.0
  // 优先 PORT（平台注入），其次 SERVER_PORT（模板约定），最后回退 3000
  const host = process.env.SERVER_HOST || '0.0.0.0';
  const port = Number(process.env.PORT || process.env.SERVER_PORT || '3000');

  // 平台内 /assets 走 CDN 且同源服务器跳过该前缀；脱离平台托管（如 Vercel）时
  // 需要自行挂载 vite 构建产物中的静态资源（prod 下 cwd=dist，资源在 client/assets）
  app.use('/assets', express.static(join(process.cwd(), 'client/assets'), { maxAge: '1y', immutable: true }));

  // 注册视图引擎, 渲染 client 目录下的 html 文件
  app.setBaseViewsDir(join(process.cwd(), 'dist/client'));
  app.setViewEngine('html');
  app.engine('html', hbsExpressEngine);

  await app.listen(port, host);
  logger.log(`Server running on ${host}:${port}`);
  logger.log(`API endpoints ready at http://${host}:${port}/api`);
}

bootstrap();
