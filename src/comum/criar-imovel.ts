import { Prisma, PrismaClient } from '@prisma/client';
import { geocodificarEndereco } from './geocodificar';
import { dadosGaleriaImovel, resolverUrlsImovel } from './imagens-imovel';

type DadosCriarImovel = {
  titulo: string;
  tipo: 'CASA' | 'APARTAMENTO' | 'TERRENO' | 'COMERCIAL';
  valor: number | Prisma.Decimal;
  cidade: string;
  bairro: string;
  status?: 'DISPONIVEL' | 'RESERVADO' | 'VENDIDO' | 'INATIVO';
  descricao?: string | null;
  imagensUrls?: string[];
  quartos?: number | null;
  areaM2?: number | null;
  cep?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geocodificar?: boolean;
};

export async function criarImovelComGaleria(
  prisma: PrismaClient,
  dados: DadosCriarImovel,
) {
  const {
    imagensUrls,
    cep,
    bairro,
    cidade,
    latitude,
    longitude,
    geocodificar = true,
    ...resto
  } = dados;
  const urls = resolverUrlsImovel({ imagensUrls });

  const coords =
    latitude != null && longitude != null
      ? { latitude, longitude }
      : geocodificar
        ? await geocodificarEndereco(bairro, cidade, cep)
        : null;

  const imovel = await prisma.imovel.create({
    data: {
      ...resto,
      bairro,
      cidade,
      cep: cep ?? null,
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    },
  });

  if (urls.length > 0) {
    await prisma.imovelImagem.createMany({
      data: dadosGaleriaImovel(imovel.id, urls),
    });
  }

  return imovel;
}
