import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './common/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,

    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/generate/jwt')
  generateJwt(@Request() req): object {
    if (
      req.headers?.username !==
        this.configService.get<string>('service.jwt.apiUsername') ||
      req.headers?.password !==
        this.configService.get<string>('service.jwt.apiPassword')
    ) {
      throw new BadRequestException('Invalid Admin Credentials !');
    }
    const response = this.authService.generateJwt({
      message: 'testing',
    });
    return { response };
  }
}
