import { TipoImovel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CamposOpcionaisImovel } from './campos-imovel.dto';

export class DtoAtualizarImovel extends CamposOpcionaisImovel {
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
}
