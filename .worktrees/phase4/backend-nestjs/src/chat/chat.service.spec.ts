import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, PrismaModule],
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
