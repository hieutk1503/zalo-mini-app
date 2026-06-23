import { Controller, Get } from '@nestjs/common';

@Controller('weather')
export class WeatherController {
  @Get()
  getWeather() {
    return { temp: "32", condition: "Nắng", emoji: "☀️" };
  }
}
