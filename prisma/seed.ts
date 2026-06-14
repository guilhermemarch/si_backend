import { Imovel, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { criarImovelComGaleria } from '../src/comum/criar-imovel';
import { resolverArquivoSeed } from '../src/comum/resolver-arquivo-seed';
import { resolverUrlsImovel } from '../src/comum/imagens-imovel';

const prisma = new PrismaClient();

type ImovelSeed = {
  titulo: string;
  tipo: 'CASA' | 'APARTAMENTO' | 'TERRENO' | 'COMERCIAL';
  valor: number;
  cidade: string;
  bairro: string;
  status: 'DISPONIVEL' | 'RESERVADO' | 'VENDIDO' | 'INATIVO';
  descricao?: string;
  imagensUrls?: string[];
  quartos?: number | null;
  areaM2?: number | null;
};

type LeadSeedTemplate = {
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  status:
    | 'NOVO'
    | 'CONTATO_REALIZADO'
    | 'VISITA_AGENDADA'
    | 'PROPOSTA_ENVIADA'
    | 'NEGOCIACAO'
    | 'GANHO'
    | 'PERDIDO';
  observacoes?: string;
  imovelIndice: number;
};

const IMOVELS_FALLBACK: ImovelSeed[] = [
  {
    titulo: 'Casa no Jardim Europa',
    tipo: 'CASA',
    valor: 850000,
    cidade: 'Sao Paulo',
    bairro: 'Jardim Europa',
    status: 'DISPONIVEL',
    descricao: 'Casa ampla em bairro residencial.',
  },
  {
    titulo: 'Apartamento no Centro',
    tipo: 'APARTAMENTO',
    valor: 420000,
    cidade: 'Campinas',
    bairro: 'Centro',
    status: 'DISPONIVEL',
    descricao: 'Apartamento bem localizado.',
  },
  {
    titulo: 'Terreno comercial',
    tipo: 'TERRENO',
    valor: 300000,
    cidade: 'Valinhos',
    bairro: 'Vila Nova',
    status: 'RESERVADO',
    descricao: 'Terreno proximo a avenida principal.',
  },
];

function statusDemo(indice: number): ImovelSeed['status'] {
  if (indice < 11) return 'DISPONIVEL';
  if (indice < 13) return 'RESERVADO';
  if (indice === 13) return 'VENDIDO';
  return 'INATIVO';
}

function carregarImoveisDoManifest(): { dados: ImovelSeed[]; usouManifest: boolean } {
  const arquivo = resolverArquivoSeed(process.env.IMOVEIS_MANIFEST_PATH, [
    '../si-assets/imoveis/manifest.json',
  ]);

  if (!fs.existsSync(arquivo)) {
    console.warn(`Manifest não encontrado em ${arquivo}. Usando fallback mínimo (3 imóveis sem foto).`);
    return { dados: IMOVELS_FALLBACK, usouManifest: false };
  }

  console.log(`Manifest carregado de ${arquivo}.`);

  const manifest = JSON.parse(fs.readFileSync(arquivo, 'utf8')) as Omit<ImovelSeed, 'status'>[];

  const dados = manifest.map((item, indice) => {
    const imagensUrls = resolverUrlsImovel(item);
    return {
      titulo: item.titulo,
      tipo: item.tipo,
      valor: item.valor,
      cidade: item.cidade,
      bairro: item.bairro,
      descricao: item.descricao,
      status: statusDemo(indice),
      imagensUrls,
      quartos: item.quartos ?? null,
      areaM2: item.areaM2 ?? null,
    };
  });

  return { dados, usouManifest: true };
}

function carregarLeadsSeed(imoveis: Imovel[]): LeadSeedTemplate[] {
  const arquivo = resolverArquivoSeed(process.env.IMOVEIS_LEADS_SEED_PATH, [
    '../si-assets/seed/leads-seed.json',
  ]);

  if (!fs.existsSync(arquivo) || imoveis.length === 0) {
    console.warn(`Leads seed não encontrado em ${arquivo}. Usando fallback mínimo.`);
    return [];
  }

  console.log(`Leads seed carregado de ${arquivo}.`);
  return JSON.parse(fs.readFileSync(arquivo, 'utf8')) as LeadSeedTemplate[];
}

async function main() {
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  const senhaViewer = await bcrypt.hash('viewer123', 10);

  await prisma.lead.deleteMany();
  await prisma.imovel.deleteMany();

  await prisma.usuario.upsert({
    where: { email: 'admin@solucoesimobiliarias.com' },
    update: { nome: 'Administrador', senhaHash: senhaAdmin, perfil: 'ADMIN' },
    create: {
      nome: 'Administrador',
      email: 'admin@solucoesimobiliarias.com',
      senhaHash: senhaAdmin,
      perfil: 'ADMIN',
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'viewer@solucoesimobiliarias.com' },
    update: { nome: 'Visualizador', senhaHash: senhaViewer, perfil: 'USUARIO' },
    create: {
      nome: 'Visualizador',
      email: 'viewer@solucoesimobiliarias.com',
      senhaHash: senhaViewer,
      perfil: 'USUARIO',
    },
  });

  const { dados: dadosImoveis, usouManifest } = carregarImoveisDoManifest();
  const imoveisCriados: Imovel[] = [];
  const geocodificarSeed = process.env.GEOCODIFICAR_SEED === 'true';

  for (const dados of dadosImoveis) {
    const imovel = await criarImovelComGaleria(prisma, { ...dados, geocodificar: geocodificarSeed });
    imoveisCriados.push(imovel);
  }

  const totalGaleria = await prisma.imovelImagem.count();
  console.log(`Seed: ${imoveisCriados.length} imóveis, ${totalGaleria} imagens na galeria.`);

  if (usouManifest && imoveisCriados.length > 0 && totalGaleria === 0) {
    throw new Error('Manifest encontrado mas nenhuma imagem foi cadastrada. Verifique imagensUrls no manifest.');
  }

  const templates = carregarLeadsSeed(imoveisCriados);

  if (templates.length > 0) {
    await prisma.lead.createMany({
      data: templates.map((lead) => ({
        nome: lead.nome,
        email: lead.email,
        telefone: lead.telefone,
        origem: lead.origem,
        status: lead.status,
        observacoes: lead.observacoes,
        imovelId: imoveisCriados[lead.imovelIndice % imoveisCriados.length].id,
      })),
    });
    console.log(`Seed: ${templates.length} leads distribuídos no funil.`);
  } else {
    const porIndice = (indice: number) => imoveisCriados[indice % imoveisCriados.length];
    await prisma.lead.createMany({
      data: [
        {
          nome: 'Mariana Souza',
          email: 'mariana@email.com',
          telefone: '11999990001',
          origem: 'Site',
          status: 'NEGOCIACAO',
          observacoes: 'Lead de fallback.',
          imovelId: porIndice(0).id,
        },
      ],
    });
    console.log('Seed: leads de fallback (leads-seed.json ausente).');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
