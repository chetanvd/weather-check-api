import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateJwt(payload: object): string {
    const token: string = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('service.jwtSecret'),
      algorithm: 'HS256',
      expiresIn: '60m',
    });

    return token;
  }
}
