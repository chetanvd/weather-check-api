import { Test, TestingModule } from '@nestjs/testing';
import { ForecastService } from './forecast.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpHelper } from '../../common/helpers/http-helper/http-helper';
import { Cache } from 'cache-manager';

describe('ForecastService', () => {
  let service: ForecastService;
  let cacheManager: Cache;
  let httpHelper: HttpHelper;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForecastService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const mockConfig = {
                'weatherApp.url': 'https://api.weatherapi.com',
                'weatherApp.apikey': 'mock-api-key',
              };
              return mockConfig[key];
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: HttpHelper,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ForecastService>(ForecastService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpHelper = module.get<HttpHelper>(HttpHelper);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached forecast if available', async () => {
    const city = 'London';
    const mockForecast = { city, forecast: 'Sunny' };

    // Mock the cache to return a cached forecast
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(JSON.stringify(mockForecast));

    const result = await service.fetchForecast(city);

    // Ensure cache is queried for the forecast
    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_forecast`);
    expect(result).toEqual(mockForecast);
  });

  it('should fetch forecast from API if not cached and cache it', async () => {
    const city = 'London';
    const mockResponse = { city, forecast: 'Rainy' };

    // Mock cache to return null (i.e., no cached forecast)
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
    // Mock the HTTP helper to return a forecast response
    jest.spyOn(httpHelper, 'get').mockResolvedValueOnce(mockResponse);
    // Mock the cache set operation
    jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(null);

    // Mock the getMillisecondsUntilEndOfDay function to return TTL in milliseconds
    const ttl = 1440 * 60 * 1000; // 24 hours in milliseconds
    jest.spyOn(service, 'getMillisecondsUntilEndOfDay').mockReturnValueOnce(ttl);

    const result = await service.fetchForecast(city);

    // Ensure cache and API interactions are as expected
    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_forecast`);
    expect(httpHelper.get).toHaveBeenCalledWith(
      'https://api.weatherapi.com/v1/forecast.json',
      {
        params: {
          q: city.trim(),
          key: 'mock-api-key',
          days: 5,
        },
      },
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      `${city}_forecast`,
      JSON.stringify(mockResponse),
      ttl,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle cache miss gracefully', async () => {
    const city = 'London';
    const mockResponse = { city, forecast: 'Cloudy' };

    // Simulate a cache miss (no cached forecast)
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
    // Mock the HTTP response
    jest.spyOn(httpHelper, 'get').mockResolvedValueOnce(mockResponse);
    // Mock the cache set
    jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(null);

    // Mock the TTL value
    const ttl = 1440 * 60 * 1000; // 24 hours in milliseconds
    jest.spyOn(service, 'getMillisecondsUntilEndOfDay').mockReturnValueOnce(ttl);

    const result = await service.fetchForecast(city);

    // Ensure cache set with the correct TTL value
    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_forecast`);
    expect(httpHelper.get).toHaveBeenCalledWith(
      'https://api.weatherapi.com/v1/forecast.json',
      {
        params: {
          q: city.trim(),
          key: 'mock-api-key',
          days: 5,
        },
      },
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      `${city}_forecast`,
      JSON.stringify(mockResponse),
      ttl,
    );
    expect(result).toEqual(mockResponse);
  });
});
