import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpHelper } from '../../common/helpers/http-helper/http-helper';

describe('WeatherService', () => {
  let service: WeatherService;
  let cacheManager: Cache;
  let httpHelper: HttpHelper;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
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

    service = module.get<WeatherService>(WeatherService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpHelper = module.get<HttpHelper>(HttpHelper);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached weather if available', async () => {
    const city = 'New York';
    const mockWeather = { city, temperature: '25°C' };

    // Mock the cache to return a cached weather response
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(JSON.stringify(mockWeather));

    const result = await service.fetchCurrentWeather(city);

    // Ensure cache is queried for the weather data
    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_weather`);
    expect(result).toEqual(mockWeather);
  });

  it('should fetch weather from API if not cached and cache it', async () => {
    const city = 'New York';
    const mockResponse = { city, temperature: '20°C' };

    // Mock cache to return null (cache miss)
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
    // Mock the HTTP helper to return a weather API response
    jest.spyOn(httpHelper, 'get').mockResolvedValueOnce(mockResponse);
    // Mock the cache set operation
    jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(null);

    // Mock the getMillisecondsUntilEndOfHour method to return TTL in milliseconds
    const ttl = 59 * 60 * 1000; // TTL will be the time until the end of the current hour (59 minutes)
    jest.spyOn(service, 'getMillisecondsUntilEndOfHour').mockReturnValueOnce(ttl);

    const result = await service.fetchCurrentWeather(city);

    // Ensure cache and API interactions are as expected
    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_weather`);
    expect(httpHelper.get).toHaveBeenCalledWith(
      'https://api.weatherapi.com/v1/current.json',
      {
        params: {
          q: city.trim(),
          key: 'mock-api-key',
        },
      },
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      `${city}_weather`,
      JSON.stringify(mockResponse),
      ttl, // Ensure that the TTL is correct (time until the end of the hour)
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle cache miss gracefully and still fetch from API', async () => {
    const city = 'New York';
    const mockResponse = { city, temperature: '18°C' };

    // Simulate a cache miss (no cached weather data)
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
    // Mock the HTTP response
    jest.spyOn(httpHelper, 'get').mockResolvedValueOnce(mockResponse);
    // Mock the cache set
    jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(null);

    // Mock the TTL calculation to be the time until the end of the hour
    const ttl = 59 * 60 * 1000; // TTL for the cache set to be until the end of the hour
    jest.spyOn(service, 'getMillisecondsUntilEndOfHour').mockReturnValueOnce(ttl);

    const result = await service.fetchCurrentWeather(city);

    // Ensure cache and API interactions are as expected
    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_weather`);
    expect(httpHelper.get).toHaveBeenCalledWith(
      'https://api.weatherapi.com/v1/current.json',
      {
        params: {
          q: city.trim(),
          key: 'mock-api-key',
        },
      },
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      `${city}_weather`,
      JSON.stringify(mockResponse),
      ttl, // Ensure TTL is set correctly
    );
    expect(result).toEqual(mockResponse);
  });
});
