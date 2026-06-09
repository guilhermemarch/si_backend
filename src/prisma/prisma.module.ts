import { Module } from '@nestjs/common';
import { ServicoPrisma } from './prisma.service';

@Module({
  providers: [ServicoPrisma],
  exports: [ServicoPrisma],
})
export class ModuloPrisma {}
