import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Difficulty } from '../enums/difficulty.enum';

export class FilterRecipesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTimeInMinutes?: number;

  @IsOptional()
  @IsString()
  ingredientName?: string;

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  take?: number;

  // Sorting
  @IsOptional()
  @IsIn(['name', 'createdAt', 'timeInMinutes']) // allowed sort fields
  sortBy?: 'name' | 'createdAt' | 'timeInMinutes';

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  sortOrder?: 'ASC' | 'DESC';
}
