import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locations } from '../../lib/database/postegresql/entity/locations.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Locations)
    private readonly locationsRepository: Repository<Locations>,
  ) {}

  async findAll(): Promise<Locations[]> {
    return this.locationsRepository.find();
  }

  findById(id: number): Promise<Locations | null> {
    return this.locationsRepository.findOneBy({ id });
  }

  findByUserId(userId: number): Promise<Locations[]> {
    return this.locationsRepository.findBy({ userId });
  }

  async create(data: Partial<Locations>): Promise<Locations> {
    const newUser = this.locationsRepository.create(data);
    return this.locationsRepository.save(newUser);
  }

  async delete(id: number): Promise<Locations | string> {
    const location = await this.findById(id);
    if (!location) {
      throw new BadRequestException('Invalid Location Id');
    }

    await this.locationsRepository.remove(location);

    return location;
  }
}
