import { TipoImovel, StatusImovel } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class DtoFiltroImoveis {
  @IsOptional()
  cidade?: string;

  @IsOptional()
  bairro?: string;

  @IsOptional()
  @IsEnum(TipoImovel)
  tipo?: TipoImovel;

  @IsOptional()
  @IsEnum(StatusImovel)
  status?: StatusImovel;
}
