import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateImageTagDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsBoolean()
  @IsOptional()
  readonly isSeasonTag?: boolean;
}
