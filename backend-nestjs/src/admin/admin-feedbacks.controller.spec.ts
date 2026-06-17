import { Test, TestingModule } from '@nestjs/testing';
import { AdminFeedbacksController } from './admin-feedbacks.controller';
import { AdminFeedbacksService } from './admin-feedbacks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

describe('AdminFeedbacksController', () => {
  let controller: AdminFeedbacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, AdminAuthModule],
      controllers: [AdminFeedbacksController],
      providers: [AdminFeedbacksService],
    }).compile();

    controller = module.get<AdminFeedbacksController>(AdminFeedbacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
