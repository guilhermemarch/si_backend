import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ServicoPrisma } from '../../prisma/prisma.service';
import { DtoAlterarStatusLead } from './dtos/alterar-status-lead.dto';
import { DtoAtualizarLead } from './dtos/atualizar-lead.dto';
import { DtoCriarLead } from './dtos/criar-lead.dto';
import { DtoFiltroLeads } from './dtos/filtro-leads.dto';

@Injectable()
export class ServicoLeads {
  constructor(private readonly prisma: ServicoPrisma) {}

  private readonly incluirImovel = {
    imovel: {
      include: {
        imagens: { orderBy: { ordem: 'asc' as const } },
      },
    },
  };

  async criar(dados: DtoCriarLead) {
    await this.validarImovel(dados.imovelId);

    return this.prisma.lead.create({
      data: this.limparDados(dados),
      include: this.incluirImovel,
    });
  }

  listar(filtros: DtoFiltroLeads) {
    const where: Prisma.LeadWhereInput = {
      nome: filtros.nome
        ? { contains: filtros.nome, mode: 'insensitive' }
        : undefined,
      status: filtros.status,
      imovelId: filtros.imovelId,
    };

    return this.prisma.lead.findMany({
      where,
      include: this.incluirImovel,
      orderBy: { criadoEm: 'desc' },
    });
  }

  async buscarPorId(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: this.incluirImovel,
    });

    if (!lead) {
      throw new NotFoundException('Lead nao encontrado');
    }

    return lead;
  }

  async atualizar(id: string, dados: DtoAtualizarLead) {
    await this.buscarPorId(id);
    await this.validarImovel(dados.imovelId);

    return this.prisma.lead.update({
      where: { id },
      data: this.limparDados(dados),
      include: this.incluirImovel,
    });
  }

  async alterarStatus(id: string, dados: DtoAlterarStatusLead) {
    await this.buscarPorId(id);

    return this.prisma.lead.update({
      where: { id },
      data: { status: dados.status },
      include: this.incluirImovel,
    });
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.lead.delete({ where: { id } });

    return { mensagem: 'Lead excluido com sucesso' };
  }

  private async validarImovel(imovelId?: string | null) {
    if (!imovelId) {
      return;
    }

    const imovel = await this.prisma.imovel.findUnique({
      where: { id: imovelId },
    });

    if (!imovel) {
      throw new NotFoundException('Imovel nao encontrado');
    }
  }

  private limparDados<
    T extends { email?: string; nome?: string; origem?: string },
  >(dados: T) {
    return {
      ...dados,
      nome: dados.nome?.trim(),
      email: dados.email?.toLowerCase().trim(),
      origem: dados.origem?.trim(),
    };
  }
}
