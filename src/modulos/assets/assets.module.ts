import { Module } from '@nestjs/common';
import { ControladorAssets } from './assets.controller';
import { ServicoAssets } from './assets.service';

@Module({
  controllers: [ControladorAssets],
  providers: [ServicoAssets],
})
export class ModuloAssets {}
