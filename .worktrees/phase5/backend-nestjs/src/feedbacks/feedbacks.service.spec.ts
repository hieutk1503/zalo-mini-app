import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksService } from './feedbacks.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('FeedbacksService', () => {
  let service: FeedbacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FeedbacksService],
    }).compile();

    service = module.get<FeedbacksService>(FeedbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
