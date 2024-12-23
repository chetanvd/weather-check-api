import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './modules/weather/weather.module';
import { ForecastModule } from './modules/forecast/forecast.module';
import { LocationsModule } from './modules/locations/locations.module';
import configuration from 'config/configuration';
import { generateUuid } from './common/helpers/helper';
import { Locations } from './lib/database/postegresql/entity/locations.entity';
import { Users } from './lib/database/postegresql/entity/users.entity';
import { AuthModule } from './common/auth/auth.module';
import { AuthService } from './common/auth/auth.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    WeatherModule,
    ForecastModule,
    LocationsModule,
    UsersModule,
    HealthModule,
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          serializers: {
            req: (req) => ({
              id: req.id,
              method: req.method,
              url: req.url,
              body: req.raw.body,
              headers: req.headers,
            }),
          },
          base: {
            service: configService.get<string>('service.name'),
          },
          genReqId: () => generateUuid(),
          autoLogging: true,
          stream: pino.destination(process.stdout),
        },
        exclude: [{ method: RequestMethod.ALL, path: '_health' }],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Locations, Users],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
