import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateContactPersonCategoryDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly position?: number;
}
