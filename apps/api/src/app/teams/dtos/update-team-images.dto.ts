import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class UpdateTeamImageDto {
  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @IsNumber()
  @IsNotEmpty()
  readonly width: number;

  @IsNumber()
  @IsNotEmpty()
  readonly height: number;
}

export class UpdateTeamImagesDto {
  @ValidateNested()
  @IsNotEmptyObject()
  readonly big: UpdateTeamImageDto;

  @ValidateNested()
  @IsNotEmptyObject()
  readonly small: UpdateTeamImageDto;

  @ValidateNested()
  @IsNotEmptyObject()
  readonly icon: UpdateTeamImageDto;

  @IsString()
  @IsNotEmpty()
  readonly updatedAt: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly disabled: boolean;
}
