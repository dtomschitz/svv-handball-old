import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { UpdateSponsorImageDto } from './update-sponsor-image.dto';

export class UpdateSponsorDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @ValidateNested()
  readonly img?: UpdateSponsorImageDto;

  @IsOptional()
  @IsUrl()
  readonly link?: string;

  @IsOptional()
  @IsNumber()
  readonly position?: number;

  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;
}
