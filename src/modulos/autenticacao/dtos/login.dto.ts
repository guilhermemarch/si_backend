import { IsEmail, MinLength } from 'class-validator';

export class DtoLogin {
  @IsEmail()
  email: string;

  @MinLength(6)
  senha: string;
}
