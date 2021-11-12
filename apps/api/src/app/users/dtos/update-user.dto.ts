import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@svv/core/models';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly role?: UserRole;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsBoolean()
  readonly canLogin?: boolean;

  @IsOptional()
  @IsString()
  readonly refreshToken?: string;

  @IsOptional()
  @IsString()
  readonly lastLogin?: string;
}
