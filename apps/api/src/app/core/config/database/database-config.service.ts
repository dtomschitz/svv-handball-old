import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Returns the default MongoDB URI which is stored in the .env file.
   *
   * @return The MongoDB URI
   */
  get MONGO_URI() {
    return this.configService.get<string>('database.MONGO_URI');
  }
}
