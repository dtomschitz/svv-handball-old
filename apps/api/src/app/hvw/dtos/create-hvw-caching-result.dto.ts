import { HvwCachingType } from '@svv/core/models';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHvwCachingResultDto {
  @IsNotEmpty()
  readonly type: HvwCachingType;

  @IsString()
  @IsNotEmpty()
  readonly neededTime: string;

  @IsNumber()
  @IsNotEmpty()
  readonly status: number;

  @IsNumber()
  @IsNotEmpty()
  readonly inserted: number;

  @IsNumber()
  @IsNotEmpty()
  readonly upserted: number;

  @IsNumber()
  @IsNotEmpty()
  readonly matched: number;

  @IsNumber()
  @IsNotEmpty()
  readonly modified: number;

  @IsNumber()
  @IsNotEmpty()
  readonly removed: number;

  @IsString()
  @IsOptional()
  readonly userId?: string;
}
