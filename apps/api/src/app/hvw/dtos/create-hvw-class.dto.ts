import { HvwClass } from '@svv/core/models';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHvwClassDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly shortName: string;

  @IsString()
  @IsNotEmpty()
  readonly longName: string;
}
