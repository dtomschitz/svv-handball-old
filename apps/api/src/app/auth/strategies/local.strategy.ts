import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@svv/api/auth/auth.service';
import { Strategy } from 'passport-local';

/**
 * This class extends the `Passport Strategy` functionality for the `local`
 * strategy. The class is used by the respective `Auth Guard` for validating
 * and authorizing the received request.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Validates the given credentials and looks for a matching `User`. If the
   * credentials are invalid the `UnauthorizedException` will be raised.
   * Otherwise the user will be returned in order to process the request further.
   *
   * @param email The email of the `User` who want to login.
   * @param password The password of the `User` who want to login.
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
