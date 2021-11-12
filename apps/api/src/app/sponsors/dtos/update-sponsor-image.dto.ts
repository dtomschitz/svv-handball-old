import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSponsorImageDto {
  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @IsString()
  @IsNotEmpty()
  readonly updatedAt: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly disabled: boolean;
}
