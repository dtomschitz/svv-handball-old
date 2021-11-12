import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateHvwGameGymnasiumDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly no: number;

  @IsNumber()
  @IsNotEmpty()
  readonly postal: number;

  @IsString()
  @IsNotEmpty()
  readonly street: string;

  @IsString()
  @IsNotEmpty()
  readonly town: string;
}

export class CreateHvwGameDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly appId: number;

  @IsString()
  @IsNotEmpty()
  readonly classId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly no: number;

  @IsNumber()
  @IsNotEmpty()
  readonly sGId: number;

  @IsString()
  @IsNotEmpty()
  readonly referee: string;

  @IsString()
  @IsNotEmpty()
  readonly weekDay: string;

  @IsString()
  @IsNotEmpty()
  readonly week: string;

  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsString()
  @IsNotEmpty()
  readonly groupsortTxt: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly live: boolean;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  readonly teams: {
    home: {
      name: string;
      points: number;
      goals: string;
      goals_1: string;
    };
    guest: {
      name: string;
      points: number;
      goals: string;
      goals_1: string;
    };
  };

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  readonly gymnasium: CreateHvwGameGymnasiumDto;
}
