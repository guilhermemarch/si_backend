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
    const urlBase =
      this.config.get<string>('IA_SERVICE_URL') ?? 'http://localhost:8000';

    const resposta = await fetch(`${urlBase}/chat/conversa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: dados.mensagem, contexto }),
    }).catch(() => null);

    if (!resposta) {
      throw new BadGatewayException('Servico de IA indisponivel');
    }

    if (!resposta.ok) {
      const corpoErro = await resposta.text().catch(() => '');
      console.error(`IA service error ${resposta.status}: ${corpoErro}`);
      throw new BadGatewayException('Servico de IA indisponivel');
    }

    const corpo = (await resposta.json()) as RespostaIa;

    return {
      resposta: corpo.resposta ?? 'Nao consegui gerar uma resposta agora.',
    };
  }

  private async montarContexto() {
    const [leads, imoveis, resumo] = await Promise.all([
      this.prisma.lead.findMany({
        take: 15,
        orderBy: { atualizadoEm: 'desc' },
        include: { imovel: { select: { titulo: true } } },
      }),
      this.prisma.imovel.findMany({
        take: 10,
        orderBy: { atualizadoEm: 'desc' },
        select: {
          id: true,
          titulo: true,
          tipo: true,
          valor: true,
          status: true,
          cidade: true,
        },
      }),
      this.dashboard.resumo(),
    ]);

    return {
      leads: leads.map((lead) => ({
        id: lead.id,
        nome: lead.nome,
        status: lead.status,
        origem: lead.origem,
        imovelTitulo: lead.imovel?.titulo ?? null,
      })),
      imoveis,
      resumo,
    };
  }
}
