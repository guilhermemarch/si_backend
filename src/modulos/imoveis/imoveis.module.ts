import { Module } from '@nestjs/common';
import { ModuloPrisma } from '../../prisma/prisma.module';
import { ControladorImoveis } from './imoveis.controller';
import { ServicoImoveis } from './imoveis.service';

@Module({
  imports: [ModuloPrisma],
  controllers: [ControladorImoveis],
  providers: [ServicoImoveis],
  exports: [ServicoImoveis],
})
export class ModuloImoveis {}
