import { TipoImovel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CamposOpcionaisImovel } from './campos-imovel.dto';

export class DtoCriarImovel extends CamposOpcionaisImovel {
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
}
