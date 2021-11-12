import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ErrorType } from '@svv/core/models';
import { AppConfigService } from '@svv/api/core/config';
import { ApiException } from '@svv/api/core/error';
import { UsersService } from '@svv/api/users/services';
import { LoginDto, LogoutDto, VerifyRefreshTokenDto } from './dtos';
import { JwtPayload } from './interfaces';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Logs the `User` in and generates the authentication tokens which are required
   * for most of the endpoints. In the first step, the credentials are validated.
   * The authentication tokens are only generated if these are correct and belong
   * to a `User`.
   *
   * @param loginDto The class which contains the validated credentials for
   * logging in the `User`.
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const { accessToken, refreshToken } = this.generateTokens({
      _id: user._id,
      email: user.email,
    });

    // Assign the refresh token to the `User`
    await this.userService.updateOne(user._id, {
      refreshToken,
      lastLogin: dayjs().toISOString(),
    });

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Logs the `User` out and removes the assigned refresh token in order to
   * prevent further authentications with the specific token.
   *
   * @param loginDto The class which contains the validated id for logging out
   * the `User`.
   */
  logout(logoutDto: LogoutDto) {
    return this.userService.updateOne(logoutDto._id, {
      refreshToken: undefined,
    });
  }

  /**
   * Verifies the given refresh token and tries to find a `User` that is
   * associated with the token.
   *
   * @param verifyRefreshTokenDto The class which contains the validated
   * refresh token which should be used for verifing the `User`.
   */
  async verify(verifyRefreshTokenDto: VerifyRefreshTokenDto) {
    const { _id } = this.jwtService.verify(verifyRefreshTokenDto.refreshToken, {
      secret: this.configService.REFRESH_TOKEN_SECRET,
    });

    return this.validateUserCanLogin(_id);
  }

  /**
   * Refreshes the access token for the `User` with the given refresh token.
   *
   * @param verifyRefreshTokenDto The class which contains the validated
   * refresh token which should be used for refreshing the access token.
   */
  async refreshAccessToken(verifyRefreshTokenDto: VerifyRefreshTokenDto) {
    const { _id, email } = this.jwtService.verify(
      verifyRefreshTokenDto.refreshToken,
      {
        secret: this.configService.REFRESH_TOKEN_SECRET,
      },
    );
    this.validateUserCanLogin(_id);
    return { accessToken: this.generateAccessToken({ _id, email }) };
  }

  /**
   * Validates the given credentials and looks for an `User` who is associated
   * with the email.
   *
   * @param email The email of the `User`.
   * @param password The password of the `User`.
   */
  validateUser(email: string, password: string) {
    return this.userService.validate(email, password);
  }

  /**
   * Checks if the `User` who is associated with the given id is authorized to
   * login.
   *
   * @param id The id of the `User`.
   */
  async validateUserCanLogin(id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ApiException(ErrorType.USER_NOT_FOUND);
    }

    if (!user?.canLogin) {
      throw new ApiException(ErrorType.USER_DISABLED);
    }

    return user;
  }

  /**
   * Verifies if the given token is valid and not expired.
   *
   * @param token The token that should be verified.
   */
  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.REFRESH_TOKEN_SECRET,
    });
  }

  /**
   * Generates the authentication tokens.
   *
   * @param payload The payload which contains the email and the password.
   */
  private generateTokens(payload: JwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Generates the access token.
   *
   * @param payload The payload which contains the email and the password.
   */
  private generateAccessToken(payload: JwtPayload) {
    return this.generateToken(
      {
        _id: payload._id,
        email: payload.email,
      },
      {
        secret: this.configService.ACCESS_TOKEN_SECRET,
        expiresIn: this.configService.ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );
  }

  /**
   * Generates the refresh token.
   *
   * @param payload The payload which contains the email and the password.
   */
  private generateRefreshToken(payload: JwtPayload) {
    return this.generateToken(
      {
        _id: payload._id,
        email: payload.email,
      },
      {
        secret: this.configService.REFRESH_TOKEN_SECRET,
        expiresIn: this.configService.REFRESH_TOKEN_EXPIRATION_TIME,
      },
    );
  }

  /**
   * Generates a new jwt token based on the given options.
   *
   * @param payload The payload which will be assigned to the jwt token.
   * @param options The options for the signing process.
   */
  private generateToken(payload: JwtPayload, options: JwtSignOptions) {
    return this.jwtService.sign(
      {
        _id: payload._id,
        email: payload.email,
      },
      options,
    );
  }
}
