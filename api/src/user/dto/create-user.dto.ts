import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers, or underscores, and cannot be blank',
  })
  userName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
    message:
      'Password too weak: must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'avatarUrl is too short' })
  @MaxLength(2048, { message: 'avatarUrl is too long' })
  avatar: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(20, { each: true })
  @Matches(/\S/, {
    each: true,
    message: 'Each dietary preference must not be blank',
  })
  dietaryPreferences: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(20, { each: true })
  @Matches(/\S/, { each: true, message: 'Each allergy must not be blank' })
  allergies: string[];
}
