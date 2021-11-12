import { registerAs } from '@nestjs/config';
import { environment } from '@svv/api/environments/environment';

/**
 * Registers the app sepcific config values in the global configuration system.
 */
export default registerAs('app', () => ({
  API_NAME: environment.API_NAME,
  PORT: environment.API_PORT,
  HVW_API_URL: environment.HVW_API_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION_TIME: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
}));
