import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../lib/database/postegresql/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
      ) {}
    
      async findAll(): Promise<Users[]> {
        return this.usersRepository.find();
      }
    
      findById(id: number): Promise<Users | null> {
        return this.usersRepository.findOneBy({ id });
      }

      async create(data: Partial<Users>): Promise<Users> {
        const newUser = this.usersRepository.create(data);
        return this.usersRepository.save(newUser);
      }
}
