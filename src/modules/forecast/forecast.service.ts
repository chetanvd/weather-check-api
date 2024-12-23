import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpHelper } from '../../common/helpers/http-helper/http-helper';

@Injectable()
export class ForecastService {
  constructor(
    private readonly httpHelper: HttpHelper,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async fetchForecast(city: string) {
    const forecast = await this.cacheManager.get<string>(`${city}_forecast`);

    if (forecast) {
      return JSON.parse(forecast);
    }

    const apiUrl = `${this.configService.get<string>('weatherApp.url')}/v1/forecast.json`;
    const queryParams = {
      q: city.trim(),
      key: this.configService.get<string>('weatherApp.apikey'),
      days: 5,
    };

    const response: any = await this.httpHelper.get(apiUrl, {
      params: queryParams,
    });

    await this.cacheManager.set(
      `${city}_forecast`,
      JSON.stringify(response),
      this.getMillisecondsUntilEndOfDay(),
    );
    return response;
  }

  getMillisecondsUntilEndOfDay() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() - now.getTime();
  }
}
