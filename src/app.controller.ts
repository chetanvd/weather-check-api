import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './common/decorators/skip-auth.decorator';
import { AuthService } from './common/auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/generate/jwt')
  @SkipAuth()
  generateJwt(): object {
    const response = this.authService.generateJwt({
      message: 'testing',
    });
    return { response };
  }
}
