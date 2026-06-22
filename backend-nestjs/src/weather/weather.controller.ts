import { Controller, Get } from '@nestjs/common';

@Controller('weather')
export class WeatherController {
  @Get()
  getWeather() {
    return { temperature: 32, location: "Đắk Lắk", icon: "01d" };
  }
}
