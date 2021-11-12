import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly subtitle?: string;

  @IsArray()
  @IsOptional()
  readonly categoryIds?: string[];

  @IsArray()
  @IsOptional()
  readonly authorIds?: string[];

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsBoolean()
  @IsOptional()
  readonly disabled?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly divided?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly pinned?: boolean;
}
