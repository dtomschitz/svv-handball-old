import { ImageType } from '@svv/core/models';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEnum(ImageType)
  @IsNotEmpty()
  readonly type: ImageType;

  @IsArray()
  @IsOptional()
  readonly tagIds?: string[];
}
