import { StatusImovel } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CamposOpcionaisImovel {
  @IsOptional()
  @IsEnum(StatusImovel)
  status?: StatusImovel;

  @IsOptional()
  descricao?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  imagensUrls?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  quartos?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  areaM2?: number;

  @IsOptional()
  @IsString()
  cep?: string;
}
