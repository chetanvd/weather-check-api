import { Controller, Get, Param, Query } from '@nestjs/common';
import { ForecastService } from './forecast.service';

@Controller('forecast')
export class ForecastController {
  constructor(private forecastService: ForecastService) {}

  @Get('/:city')
  async fetchForecast(@Param('city') city: string) {
    const response = await this.forecastService.fetchForecast(city);
    return response;
  }
}
