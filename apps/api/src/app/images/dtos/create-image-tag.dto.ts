import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateImageTagDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly isSeasonTag: boolean;
}
