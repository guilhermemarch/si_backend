import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServicoPrisma } from '../../prisma/prisma.service';
import { ServicoDashboard } from '../dashboard/dashboard.service';
import { DtoConversaChatbot } from './dtos/conversa-chatbot.dto';

type RespostaIa = {
  resposta?: string;
};

@Injectable()
export class ServicoChatbot {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly dashboard: ServicoDashboard,
    private readonly config: ConfigService,
  ) {}

  async conversar(dados: DtoConversaChatbot) {
    const contexto = await this.montarContexto();
    const urlBase = this.config.get<string>('IA_SERVICE_URL') ?? 'http://localhost:8000';

    const resposta = await fetch(`${urlBase}/chat/conversa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: dados.mensagem, contexto }),
    }).catch(() => null);

    if (!resposta?.ok) {
      throw new BadGatewayException('Servico de IA indisponivel');
    }

    const corpo = (await resposta.json()) as RespostaIa;

    return { resposta: corpo.resposta ?? 'Nao consegui gerar uma resposta agora.' };
  }

  private async montarContexto() {
    const [leads, imoveis, resumo] = await Promise.all([
      this.prisma.lead.findMany({
        take: 50,
        orderBy: { atualizadoEm: 'desc' },
        include: { imovel: true },
      }),
      this.prisma.imovel.findMany({
        take: 50,
        orderBy: { atualizadoEm: 'desc' },
      }),
      this.dashboard.resumo(),
    ]);

    return { leads, imoveis, resumo };
  }
}
