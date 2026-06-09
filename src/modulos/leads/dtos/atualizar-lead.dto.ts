import { StatusLead } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class DtoAtualizarLead {
  @IsOptional()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  telefone?: string;

  @IsOptional()
  origem?: string;

  @IsOptional()
  @IsEnum(StatusLead)
  status?: StatusLead;

  @IsOptional()
  observacoes?: string;

  @IsOptional()
  @IsUUID()
  imovelId?: string | null;
}
