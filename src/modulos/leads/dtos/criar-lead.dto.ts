import { StatusLead } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class DtoCriarLead {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  telefone: string;

  @IsNotEmpty()
  origem: string;

  @IsOptional()
  @IsEnum(StatusLead)
  status?: StatusLead;

  @IsOptional()
  observacoes?: string;

  @IsOptional()
  @IsUUID()
  imovelId?: string;
}
