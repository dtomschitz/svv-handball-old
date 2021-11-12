import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateSponsorDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  readonly link: string;

  @IsNumber()
  @IsNotEmpty()
  readonly position: number;
}
