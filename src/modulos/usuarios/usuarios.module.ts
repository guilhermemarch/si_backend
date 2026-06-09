import { Module } from '@nestjs/common';
import { ModuloPrisma } from '../../prisma/prisma.module';
import { ServicoUsuarios } from './usuarios.service';

@Module({
  imports: [ModuloPrisma],
  providers: [ServicoUsuarios],
  exports: [ServicoUsuarios],
})
export class ModuloUsuarios {}
