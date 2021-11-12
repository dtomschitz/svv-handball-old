import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto, LogoutDto, VerifyRefreshTokenDto } from './dtos';
import { LocalAuthGuard, JwtRefreshGuard, JwtAuthGuard } from './guards';
import { AuthService } from './auth.service';

/**
 * This class implements the controller functionality for the `Authentication`
 * feature including all necessary endpoints which are accessd by the
 * CMS application.
 *
 * All handler methods inside the controller are either secured with the
 * `LocalAuthGuard`, `JwtAuthGuard` or the `JwtRefreshGuard`.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Route is used to verify and login a `User` with the given credentials.
   * If the login was successful the response will contain an access and refresh
   * token which are associated with this specific `User`. The refresh token can
   * be used for refreshing the acces token if it is expired.
   *
   * This route is secured with the `LocalAuthGuard`. In order to access this
   * route the request must contain a valid email and password.
   *
   * @param loginDto The class which contains the validated crendentials of the
   * `User` who wants to login.
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Route is used to logout a `User` and remove the associated refresh token.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param logoutDto The class which contains the validated id of the
   * `User` who want to logout.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Body(ValidationPipe) logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  /**
   * Route is used to verify an `User` by validating the refresh token with the
   * one that is stored in the database. If the refresh token has been validated
   * successfully, the associated user will be returned.
   *
   * This route is secured with the `JwtRefreshGuard`. In order to access this
   * route the request must contain a valid and not expired refresh token.
   *
   * @param verifyRefreshTokenDto The class which contains the validated refresh
   * token which is associated with an `User`.
   */
  @Post('verify')
  @UseGuards(JwtRefreshGuard)
  verify(@Body(ValidationPipe) verifyRefreshTokenDto: VerifyRefreshTokenDto) {
    return this.authService.verify(verifyRefreshTokenDto);
  }

  /**
   * Route is used to refresh an expired access token. If the given refresh token
   * is assigned to a existing `User` and its valid, a new access token
   * will be generated.
   *
   * This route is secured with the `JwtRefreshGuard`. In order to access this
   * route the request must contain a valid and not expired refresh token.
   *
   * @param verifyRefreshTokenDto The class which contains the validated refresh
   * token which is associated with an `User`.
   */
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Body(ValidationPipe) verifyRefreshTokenDto: VerifyRefreshTokenDto) {
    return this.authService.refreshAccessToken(verifyRefreshTokenDto);
  }
}
