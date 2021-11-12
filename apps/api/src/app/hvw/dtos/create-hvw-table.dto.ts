import { HvwScore } from '@svv/core/models';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateHvwTableDto {
  @IsString()
  @IsNotEmpty()
  readonly classId: string;

  @IsArray()
  @IsNotEmpty()
  readonly scores: HvwScore[];
}
