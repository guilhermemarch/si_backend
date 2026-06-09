import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ServicoPrisma } from '../../prisma/prisma.service';
import { DtoAtualizarImovel } from './dtos/atualizar-imovel.dto';
import { DtoCriarImovel } from './dtos/criar-imovel.dto';
import { DtoFiltroImoveis } from './dtos/filtro-imoveis.dto';

@Injectable()
export class ServicoImoveis {
  constructor(private readonly prisma: ServicoPrisma) {}

  criar(dados: DtoCriarImovel) {
    return this.prisma.imovel.create({ data: dados });
  }

  listar(filtros: DtoFiltroImoveis) {
    const where: Prisma.ImovelWhereInput = {
      cidade: filtros.cidade
        ? { contains: filtros.cidade, mode: 'insensitive' }
        : undefined,
      bairro: filtros.bairro
        ? { contains: filtros.bairro, mode: 'insensitive' }
        : undefined,
      tipo: filtros.tipo,
      status: filtros.status,
    };

    return this.prisma.imovel.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
    });
  }

  async buscarPorId(id: string) {
    const imovel = await this.prisma.imovel.findUnique({ where: { id } });

    if (!imovel) {
      throw new NotFoundException('Imovel nao encontrado');
    }

    return imovel;
  }

  async atualizar(id: string, dados: DtoAtualizarImovel) {
    await this.buscarPorId(id);

    return this.prisma.imovel.update({
      where: { id },
      data: dados,
    });
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.imovel.delete({ where: { id } });

    return { mensagem: 'Imovel excluido com sucesso' };
  }
}
