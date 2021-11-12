import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContactPersonDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly categoryId: string;

  @IsArray()
  @IsOptional()
  readonly people?: string[];

  @IsNumber()
  @IsOptional()
  readonly position: number;
}
