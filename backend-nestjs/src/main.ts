import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { env } from './config/env';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: '*',
    credentials: false,
    allowedHeaders: 'ngrok-skip-browser-warning, x-zalo-access-token, content-type, authorization, x-zalo-id, accept, x-full-name, x-phone, x-requested-with, x-organization-id',
  });

  app.useStaticAssets(join(process.cwd(), env.uploadDir), {
    prefix: '/uploads/',
  });

  await app.listen(env.port);
}
void bootstrap();


