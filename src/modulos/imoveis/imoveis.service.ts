import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { criarImovelComGaleria } from '../../comum/criar-imovel';
import { geocodificarEndereco } from '../../comum/geocodificar';
import {
  dadosGaleriaImovel,
  resolverUrlsImovel,
} from '../../comum/imagens-imovel';
import { ServicoPrisma } from '../../prisma/prisma.service';
import { DtoAtualizarImovel } from './dtos/atualizar-imovel.dto';
import { DtoCriarImovel } from './dtos/criar-imovel.dto';
import { DtoFiltroImoveis } from './dtos/filtro-imoveis.dto';

@Injectable()
export class ServicoImoveis {
  constructor(private readonly prisma: ServicoPrisma) {}

  private async enriquecerComCoordenadas<
    T extends DtoCriarImovel | DtoAtualizarImovel,
  >(
    dados: T,
    atual?: {
      bairro: string;
      cidade: string;
      cep: string | null;
      latitude: number | null;
      longitude: number | null;
    },
  ): Promise<T & { latitude?: number; longitude?: number }> {
    const bairro = dados.bairro ?? atual?.bairro;
    const cidade = dados.cidade ?? atual?.cidade;
    const cep = dados.cep ?? atual?.cep;

    if (!bairro || !cidade) return dados;

    const enderecoMudou =
      !atual ||
      (dados.bairro != null && dados.bairro !== atual.bairro) ||
      (dados.cidade != null && dados.cidade !== atual.cidade) ||
      (dados.cep != null && dados.cep !== atual.cep);

    const semCoords =
      !atual || atual.latitude == null || atual.longitude == null;

    if (atual && !enderecoMudou && !semCoords) return dados;

    const coords = await geocodificarEndereco(bairro, cidade, cep);
    if (!coords) return dados;

    return {
      ...dados,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  }

  private async sincronizarImagens(imovelId: string, urls: string[]) {
    await this.prisma.imovelImagem.deleteMany({ where: { imovelId } });

    const dados = dadosGaleriaImovel(imovelId, urls);
    if (dados.length === 0) return;

    await this.prisma.imovelImagem.createMany({ data: dados });
  }

  async criar(dados: DtoCriarImovel) {
    const { imagensUrls, ...resto } = dados;

    const imovel = await criarImovelComGaleria(this.prisma, {
      ...resto,
      status: resto.status ?? 'DISPONIVEL',
      imagensUrls,
    });

    return this.buscarPorId(imovel.id);
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
      include: {
        imagens: {
          orderBy: { ordem: 'asc' },
        },
      },
    });
  }

  async buscarPorId(id: string) {
    const imovel = await this.prisma.imovel.findUnique({
      where: { id },
      include: {
        imagens: {
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!imovel) {
      throw new NotFoundException('Imovel nao encontrado');
    }

    return imovel;
  }

  async atualizar(id: string, dados: DtoAtualizarImovel) {
    const { imagensUrls, ...resto } = dados;
    const atual = await this.buscarPorId(id);
    const enriquecido = await this.enriquecerComCoordenadas(resto, atual);

    const imagensAlteradas = imagensUrls !== undefined;
    const urls = imagensAlteradas ? resolverUrlsImovel({ imagensUrls }) : [];

    await this.prisma.imovel.update({
      where: { id },
      data: { ...enriquecido },
    });

    if (imagensAlteradas) {
      await this.sincronizarImagens(id, urls);
    }

    return this.buscarPorId(id);
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.imovel.delete({ where: { id } });

    return { mensagem: 'Imovel excluido com sucesso' };
  }
}
