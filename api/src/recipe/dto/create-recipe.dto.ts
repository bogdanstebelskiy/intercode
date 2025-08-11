import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Difficulty } from '../enums/difficulty.enum';
import { Unit } from '../enums/unit.enum';
import { Type } from 'class-transformer';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsEnum(Unit)
  unit: Unit;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  timeInMinutes: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];
}
