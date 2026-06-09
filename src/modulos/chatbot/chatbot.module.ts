import { Module } from '@nestjs/common';
import { ModuloPrisma } from '../../prisma/prisma.module';
import { ModuloDashboard } from '../dashboard/dashboard.module';
import { ControladorChatbot } from './chatbot.controller';
import { ServicoChatbot } from './chatbot.service';

@Module({
  imports: [ModuloPrisma, ModuloDashboard],
  controllers: [ControladorChatbot],
  providers: [ServicoChatbot],
})
export class ModuloChatbot {}
