import { Module } from '@nestjs/common';
import { ModuloPrisma } from '../../prisma/prisma.module';
import { ControladorDashboard } from './dashboard.controller';
import { ServicoDashboard } from './dashboard.service';

@Module({
  imports: [ModuloPrisma],
  controllers: [ControladorDashboard],
  providers: [ServicoDashboard],
  exports: [ServicoDashboard],
})
export class ModuloDashboard {}
