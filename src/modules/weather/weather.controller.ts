import { Controller, Get, HttpException, Logger, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('/:city')
  async fetchCurrentWeather(@Param('city') city: string) {
    const response = await this.weatherService.fetchCurrentWeather(city);
    return response;
  }
}
