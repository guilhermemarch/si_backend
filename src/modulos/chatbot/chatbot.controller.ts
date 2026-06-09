import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../comum/guards/jwt.guard';
import { ServicoChatbot } from './chatbot.service';
import { DtoConversaChatbot } from './dtos/conversa-chatbot.dto';

@UseGuards(JwtGuard)
@Controller('chatbot')
export class ControladorChatbot {
  constructor(private readonly chatbot: ServicoChatbot) {}

  @Post('conversa')
  conversar(@Body() dados: DtoConversaChatbot) {
    return this.chatbot.conversar(dados);
  }
}
