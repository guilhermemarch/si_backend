import { StatusLead } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class DtoFiltroLeads {
  @IsOptional()
  nome?: string;

  @IsOptional()
  @IsEnum(StatusLead)
  status?: StatusLead;

  @IsOptional()
  @IsUUID()
  imovelId?: string;
}
