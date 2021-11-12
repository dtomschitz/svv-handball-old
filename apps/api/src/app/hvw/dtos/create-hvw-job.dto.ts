import { HvwCachingType } from '@svv/core/models';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHvwJobDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly type: HvwCachingType;

  @IsString()
  @IsNotEmpty()
  readonly cronExpression: string;

  @IsString()
  @IsOptional()
  readonly disabled?: boolean;
}
