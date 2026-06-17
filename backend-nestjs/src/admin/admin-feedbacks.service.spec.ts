import { Test, TestingModule } from '@nestjs/testing';
import { AdminFeedbacksService } from './admin-feedbacks.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('AdminFeedbacksService', () => {
  let service: AdminFeedbacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AdminFeedbacksService],
    }).compile();

    service = module.get<AdminFeedbacksService>(AdminFeedbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
