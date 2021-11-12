import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@svv/api/core/config/app';
import { JwtPayload } from '@svv/api/auth/interfaces';

/**
 * This class extends the `Passport Strategy` functionality for the
 * `jwt-refresh-token` strategy. The class is used by the respective
 * `Auth Guard` for validating and authorizing the received request.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(readonly configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: true,
      secretOrKey: configService.REFRESH_TOKEN_SECRET,
    });
  }

  /**
   * @param payload The validated payload.
   * @returns The credentials payload.
   */
  async validate(payload: JwtPayload) {
    return { _id: payload._id, email: payload.email };
  }
}
