import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpHelper } from '../../common/helpers/http-helper/http-helper';

@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, HttpHelper]
})
export class WeatherModule {}
