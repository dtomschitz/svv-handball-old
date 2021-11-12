import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly abbreviation: string;

  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly classId?: string;

  @IsOptional()
  @IsString()
  readonly articleCategoryId?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly position: number;
}
