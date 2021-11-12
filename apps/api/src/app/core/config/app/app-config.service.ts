import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Returns the default API name which is stored in the .env file.
   *
   * @returns The default API name.
   */
  get API_NAME() {
    return this.configService.get<string>('app.API_NAME');
  }

  /**
   * Returns the default API port which is stored in the .env file.
   *
   * @returns The default API port.
   */
  get API_PORT() {
    return this.configService.get<number>('app.PORT');
  }

  /**
   * Returns the URL of the HVW API which is stored in the .env file.
   *
   * @returns The HVW API URL.
   */
  get HVW_API_URL() {
    return this.configService.get<string>('app.HVW_API_URL');
  }

  /**
   * Returns the JWT access token secret which is stored in the .env file.
   *
   * @returns The JWT access token secret.
   */
  get ACCESS_TOKEN_SECRET() {
    return this.configService.get<string>('app.ACCESS_TOKEN_SECRET');
  }

  /**
   * Returns the default JWT access token expiration time which is stored in
   * the .env file.
   *
   * @returns The JWT access token expiration time.
   */
  get ACCESS_TOKEN_EXPIRATION_TIME() {
    return this.configService.get<string>('app.ACCESS_TOKEN_EXPIRATION_TIME');
  }

  /**
   * Returns the JWT refresh token secret which is stored in the .env file.
   *
   * @returns The JWT refresh token secret.
   */
  get REFRESH_TOKEN_SECRET() {
    return this.configService.get<string>('app.REFRESH_TOKEN_SECRET');
  }

  /**
   * Returns the default JWT refresh token expiration time which is stored in
   * the .env file.
   *
   * @returns The JWT refresh token expiration time.
   */
  get REFRESH_TOKEN_EXPIRATION_TIME() {
    return this.configService.get<string>('app.REFRESH_TOKEN_EXPIRATION_TIME');
  }
}
