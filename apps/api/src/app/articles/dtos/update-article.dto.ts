import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly subtitle?: string;

  @IsOptional()
  @IsArray()
  readonly categoryIds?: string[];

  @IsOptional()
  @IsArray()
  readonly authorIds?: string[];

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsBoolean()
  readonly pinned?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly divided?: boolean;
}
