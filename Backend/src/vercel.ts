import { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';


let cachedApp: INestApplication<any>;

async function buildNestApp() {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule);
    cachedApp.enableCors({
      origin:"*", // Frontend URL
      methods: 'GET, POST, PUT, DELETE',
      credentials: true,
    });
  }
  return cachedApp;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const app = await buildNestApp();

  // Handle CORS in response headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // This will call the NestJS app
  await app.init();
  return app.getHttpAdapter().getInstance()(req, res);
};
