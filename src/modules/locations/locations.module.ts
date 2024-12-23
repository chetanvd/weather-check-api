import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Locations } from '../../lib/database/postegresql/entity/locations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Locations]), JwtModule],
  controllers: [LocationsController],
  providers: [LocationsService]
})
export class LocationsModule {}
