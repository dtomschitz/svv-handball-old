import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly link?: string;
}
