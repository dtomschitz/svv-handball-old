import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContactPersonCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsOptional()
  readonly position: number;
}
