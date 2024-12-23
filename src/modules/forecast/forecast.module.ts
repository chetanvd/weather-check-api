import { Module } from '@nestjs/common';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';
import { HttpModule } from '@nestjs/axios';
import { HttpHelper } from '../../common/helpers/http-helper/http-helper';

@Module({
  imports: [HttpModule],
  controllers: [ForecastController],
  providers: [ForecastService, HttpHelper]
})
export class ForecastModule {}
