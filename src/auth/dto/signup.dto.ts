import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
  @IsISO8601()
  date: Date;
}
