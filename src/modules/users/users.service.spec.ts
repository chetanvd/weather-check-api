import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../lib/database/postegresql/entity/users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Users>;

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, username: 'John' }, { id: 2, username: 'Jane' }];
      mockUsersRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const result = { id: 1, username: 'John' };
      mockUsersRepository.findOneBy.mockResolvedValue(result);

      expect(await service.findById(1)).toEqual(result);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if user is not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      expect(await service.findById(999)).toBeNull();
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('create', () => {
    it('should create a new user and return the user', async () => {
      const createUserData = { username: 'John' };
      const result = { id: 1, ...createUserData };
      mockUsersRepository.create.mockReturnValue(createUserData);
      mockUsersRepository.save.mockResolvedValue(result);

      expect(await service.create(createUserData)).toEqual(result);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserData);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(createUserData);
    });
  });
});
