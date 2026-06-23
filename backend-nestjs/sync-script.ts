import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AiSyncService } from './src/ai-sync/ai-sync.service';

async function bootstrap() {
  console.log('Khởi tạo hệ thống đồng bộ AI...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const syncService = app.get(AiSyncService);
  
  console.log('Đang cày xới lại toàn bộ Database và nạp vào não Chatbot...');
  await syncService.syncAllKnowledge();
  
  console.log('Đồng bộ thành công! Não bộ AI đã được làm mới.');
  await app.close();
}

bootstrap();
