import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
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
}
