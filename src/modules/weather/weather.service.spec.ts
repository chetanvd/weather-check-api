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

    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(JSON.stringify(mockWeather));

    const result = await service.fetchCurrentWeather(city);

    expect(cacheManager.get).toHaveBeenCalledWith(`${city}_weather`);
    expect(result).toEqual(mockWeather);
  });

  it('should fetch weather from API if not cached and cache it', async () => {
    const city = 'New York';
    const mockResponse = { city, temperature: '20°C' };

    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
    jest.spyOn(httpHelper, 'get').mockResolvedValueOnce(mockResponse);
    jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(null);

    const result = await service.fetchCurrentWeather(city);

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
      1 * 60 * 1000, // TTL in milliseconds
    );
    expect(result).toEqual(mockResponse);
  });
});
