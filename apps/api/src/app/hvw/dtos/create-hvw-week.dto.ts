import { HvwWeek } from '@svv/core/models';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHvwWeekDto {
  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsBoolean()
  @IsOptional()
  readonly current?: boolean;
}
