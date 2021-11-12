import { ImageType } from '@svv/core/models';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateImageDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsEnum(ImageType)
  @IsOptional()
  readonly type?: ImageType;

  @IsArray()
  @IsOptional()
  readonly tagIds?: string[];

  @IsBoolean()
  @IsOptional()
  readonly disabled?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly archived?: boolean;
}
