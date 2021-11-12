import { registerAs } from '@nestjs/config';
import { environment } from '@svv/api/environments/environment';

/**
 * Registers the database config values in the global configuration system.
 */
export default registerAs('database', () => ({
  MONGO_URI: environment.MONGO_URI,
}));
