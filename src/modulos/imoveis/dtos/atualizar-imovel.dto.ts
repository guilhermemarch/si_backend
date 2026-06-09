import { TipoImovel, StatusImovel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class DtoAtualizarImovel {
  @IsOptional()
  titulo?: string;

  @IsOptional()
  @IsEnum(TipoImovel)
  tipo?: TipoImovel;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valor?: number;

  @IsOptional()
  cidade?: string;

  @IsOptional()
  bairro?: string;

  @IsOptional()
  @IsEnum(StatusImovel)
  status?: StatusImovel;

  @IsOptional()
  descricao?: string;
}
