import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpHelper } from '../../common/helpers/http-helper/http-helper';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpHelper: HttpHelper,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async fetchCurrentWeather(city: string) {
    const weather = await this.cacheManager.get<string>(`${city}_weather`);

    if (weather) {
      return JSON.parse(weather);
    }
    const apiUrl = `${this.configService.get<string>('weatherApp.url')}/v1/current.json`;
    const queryParams = {
      q: city.trim(),
      key: this.configService.get<string>('weatherApp.apikey'),
    };

    const response: any = await this.httpHelper.get(apiUrl, {
      params: queryParams,
    });

    await this.cacheManager.set(
      `${city}_weather`,
      JSON.stringify(response),
      this.getMillisecondsUntilEndOfHour(),
    );
    return response;
  }

  getMillisecondsUntilEndOfHour() {
    const now = new Date();
    const endOfHour = new Date(now);
    endOfHour.setMinutes(59, 59, 999); // Set to the last millisecond of the current hour
    return endOfHour.getTime() - now.getTime();
  }
}
