import { Module } from '@nestjs/common';
import { ModuloPrisma } from '../../prisma/prisma.module';
import { ControladorLeads } from './leads.controller';
import { ServicoLeads } from './leads.service';

@Module({
  imports: [ModuloPrisma],
  controllers: [ControladorLeads],
  providers: [ServicoLeads],
  exports: [ServicoLeads],
})
export class ModuloLeads {}
