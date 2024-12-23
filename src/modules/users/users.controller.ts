import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '../../lib/database/postegresql/entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../common/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
      ) {}
    
      @Get()
      async getAllUsers(): Promise<Users[]> {
        return await this.usersService.findAll();
      }

      @Get('/:id')
      async getUserById(@Param('id') id: number): Promise<Users | null> {
        return await this.usersService.findById(id);
      }

      @Post()
      async CreateUser(@Body() createUser: CreateUserDto): Promise<Users> {
        return await this.usersService.create(createUser);
      }
}
