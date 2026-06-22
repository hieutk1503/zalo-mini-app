import { Controller, Get } from '@nestjs/common';

@Controller('events')
export class EventsController {
  @Get()
  getEvents() {
    return [];
  }
}
