import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule, AppConfigService } from '@svv/api/core/config/app';
import { UsersModule } from '@svv/api//users';
import { JwtStrategy, JwtRefreshStrategy, LocalStrategy } from './strategies';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.ACCESS_TOKEN_SECRET,
        signOptions: {
          expiresIn: configService.ACCESS_TOKEN_EXPIRATION_TIME,
        },
      }),
      inject: [AppConfigService],
    }),
    AppConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
