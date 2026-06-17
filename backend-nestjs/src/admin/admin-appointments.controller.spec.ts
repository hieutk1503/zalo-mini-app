import { Test, TestingModule } from '@nestjs/testing';
import { AdminAppointmentsController } from './admin-appointments.controller';
import { AdminAppointmentsService } from './admin-appointments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

describe('AdminAppointmentsController', () => {
  let controller: AdminAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, AdminAuthModule],
      controllers: [AdminAppointmentsController],
      providers: [AdminAppointmentsService],
    }).compile();

    controller = module.get<AdminAppointmentsController>(AdminAppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
