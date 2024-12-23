import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Locations } from '../../lib/database/postegresql/entity/locations.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { AuthGuard } from '../../common/auth/auth.guard';

@Controller('locations')
@UseGuards(AuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async getAllLocations(): Promise<Locations[]> {
    return await this.locationsService.findAll();
  }

  @Get('/:id')
  async getLocationById(@Param('id') id: number): Promise<Locations | null> {
    return await this.locationsService.findById(id);
  }

  @Get('/user/:userId')
  async getLocationByUserId(@Param('userId') userId: number): Promise<Locations[]> {
    return await this.locationsService.findByUserId(userId);
  }

  @Post()
  async CreateUser(@Body() createLocation: CreateLocationDto): Promise<Locations> {
    return await this.locationsService.create(createLocation);
  }

  @Delete('/:id')
  async DeleteLocationUser(@Param('id') id: number): Promise<Locations | string> {
    return await this.locationsService.delete(id);
  }
}
