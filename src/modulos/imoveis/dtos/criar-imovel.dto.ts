import { TipoImovel, StatusImovel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DtoCriarImovel {
  @IsNotEmpty()
  titulo: string;

  @IsEnum(TipoImovel)
  tipo: TipoImovel;

  @Type(() => Number)
  @IsNumber()
  valor: number;

  @IsNotEmpty()
  cidade: string;

  @IsNotEmpty()
  bairro: string;

  @IsOptional()
  @IsEnum(StatusImovel)
  status?: StatusImovel;

  @IsOptional()
  descricao?: string;
}
