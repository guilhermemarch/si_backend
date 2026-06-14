import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './comum/guards/roles.guard';
import { ModuloAssets } from './modulos/assets/assets.module';
import { ModuloAutenticacao } from './modulos/autenticacao/autenticacao.module';
import { ModuloChatbot } from './modulos/chatbot/chatbot.module';
import { ModuloDashboard } from './modulos/dashboard/dashboard.module';
import { ModuloImoveis } from './modulos/imoveis/imoveis.module';
import { ModuloLeads } from './modulos/leads/leads.module';
import { ModuloUsuarios } from './modulos/usuarios/usuarios.module';
import { ModuloPrisma } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloPrisma,
    ModuloAssets,
    ModuloUsuarios,
    ModuloAutenticacao,
    ModuloImoveis,
    ModuloLeads,
    ModuloDashboard,
    ModuloChatbot,
  ],
  providers: [RolesGuard],
})
export class AppModule {}
