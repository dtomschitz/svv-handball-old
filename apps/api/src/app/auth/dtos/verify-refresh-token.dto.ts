import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
