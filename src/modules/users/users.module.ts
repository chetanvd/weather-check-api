import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { Users } from '../../lib/database/postegresql/entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
})
export class UsersModule {}
