import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender, TeamSettings, TeamType } from '@svv/core/models';
import { UpdateTeamImagesDto } from './update-team-images.dto';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  readonly abbreviation?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly gender?: Gender;

  @IsOptional()
  @IsString()
  readonly type?: TeamType;

  @IsOptional()
  @IsNumber()
  readonly position?: number;

  @IsOptional()
  @IsObject()
  readonly settings?: TeamSettings;

  @IsOptional()
  @ValidateNested()
  readonly images?: UpdateTeamImagesDto;

  @IsOptional()
  @IsString()
  readonly contact?: string;

  @IsOptional()
  @IsNumber()
  readonly priority?: number;

  @IsOptional()
  @IsString()
  readonly classId?: string;

  @IsOptional()
  @IsString()
  readonly articleCategoryId?: string;

  @IsOptional()
  @IsArray()
  readonly trainingTimes?: any[];

  @IsOptional()
  @IsArray()
  readonly coachIds?: string[];

  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;
}
