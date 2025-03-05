import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
export class AuthCredentialDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(33)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  }) //password must contain at least one uppercase letter, one lowercase letter, one number or special character, and must be at least 8 characters long
  password: string;
}
