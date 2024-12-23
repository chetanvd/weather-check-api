import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locations } from '../../lib/database/postegresql/entity/locations.entity';
import { BadRequestException } from '@nestjs/common';

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: Repository<Locations>;

  const mockLocationsRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Locations),
          useValue: mockLocationsRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<Repository<Locations>>(getRepositoryToken(Locations));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const result = [
        { id: 1, title: 'Location 1', userId: 1 },
        { id: 2, title: 'Location 2', userId: 2 },
      ];
      mockLocationsRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockLocationsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a location by id', async () => {
      const result = { id: 1, title: 'Location 1', userId: 1 };
      mockLocationsRepository.findOneBy.mockResolvedValue(result);

      expect(await service.findById(1)).toEqual(result);
      expect(mockLocationsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if location is not found', async () => {
      mockLocationsRepository.findOneBy.mockResolvedValue(null);

      expect(await service.findById(999)).toBeNull();
      expect(mockLocationsRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findByUserId', () => {
    it('should return an array of locations for the given userId', async () => {
      const result = [
        { id: 1, title: 'Location 1', userId: 1 },
        { id: 2, title: 'Location 2', userId: 1 },
      ];
      mockLocationsRepository.findBy.mockResolvedValue(result);

      expect(await service.findByUserId(1)).toEqual(result);
      expect(mockLocationsRepository.findBy).toHaveBeenCalledWith({ userId: 1 });
    });
  });

  describe('create', () => {
    it('should create and return a new location', async () => {
      const createLocationData = { title: 'New Location', userId: 1 };
      const result = { id: 1, ...createLocationData };
      mockLocationsRepository.create.mockReturnValue(createLocationData);
      mockLocationsRepository.save.mockResolvedValue(result);

      expect(await service.create(createLocationData)).toEqual(result);
      expect(mockLocationsRepository.create).toHaveBeenCalledWith(createLocationData);
      expect(mockLocationsRepository.save).toHaveBeenCalledWith(createLocationData);
    });
  });

  describe('delete', () => {
    it('should delete a location and return it', async () => {
      const locationToDelete = { id: 1, title: 'Location 1', userId: 1 };
      mockLocationsRepository.findOneBy.mockResolvedValue(locationToDelete);
      mockLocationsRepository.remove.mockResolvedValue(locationToDelete);

      const result = await service.delete(1);
      expect(result).toEqual(locationToDelete);
      expect(mockLocationsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockLocationsRepository.remove).toHaveBeenCalledWith(locationToDelete);
    });

    it('should throw a BadRequestException if location is not found', async () => {
      mockLocationsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(BadRequestException);
      await expect(service.delete(999)).rejects.toThrow('Invalid Location Id');
      expect(mockLocationsRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
