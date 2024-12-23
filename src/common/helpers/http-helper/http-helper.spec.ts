import { Test, TestingModule } from '@nestjs/testing';
import { HttpHelper } from './http-helper';
import { HttpModule } from '@nestjs/axios';

describe('HttpHelperService', () => {
  let service: HttpHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [HttpHelper],
    }).compile();

    service = module.get<HttpHelper>(HttpHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
