import { IsOptional, IsString, IsObject, IsBoolean } from 'class-validator';
import { HvwCachingType } from '@svv/core/models';

export class UpdateHvwJobDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsObject()
  @IsOptional()
  readonly type?: HvwCachingType;

  @IsString()
  @IsOptional()
  readonly cronExpression?: string;

  @IsString()
  @IsOptional()
  readonly lastExecution?: string;

  @IsBoolean()
  @IsOptional()
  readonly disabled?: boolean;
}
