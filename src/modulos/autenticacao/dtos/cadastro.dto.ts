import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class DtoCadastro {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  senha: string;
}
