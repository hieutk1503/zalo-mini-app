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
    origin: env.nodeEnv === 'production'
      ? ['https://your-zalo-domain.com']
      : true,
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), env.uploadDir), {
    prefix: '/uploads/',
  });

  await app.listen(env.port);
}
void bootstrap();


