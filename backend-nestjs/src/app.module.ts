import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProceduresModule } from './procedures/procedures.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, ProceduresModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
