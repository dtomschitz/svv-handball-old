import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateContactPersonDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly categoryId?: string;

  @IsOptional()
  @IsArray()
  readonly people?: string[];

  @IsOptional()
  @IsNumber()
  readonly position?: number;

  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;
}
