import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10);

  await prisma.lead.deleteMany();
  await prisma.imovel.deleteMany();

  await prisma.usuario.upsert({
    where: { email: 'admin@solucoesimobiliarias.com' },
    update: { nome: 'Administrador', senhaHash, perfil: 'ADMIN' },
    create: {
      nome: 'Administrador',
      email: 'admin@solucoesimobiliarias.com',
      senhaHash,
      perfil: 'ADMIN',
    },
  });

  const casa = await prisma.imovel.create({
    data: {
      titulo: 'Casa no Jardim Europa',
      tipo: 'CASA',
      valor: 850000,
      cidade: 'Sao Paulo',
      bairro: 'Jardim Europa',
      status: 'DISPONIVEL',
      descricao: 'Casa ampla em bairro residencial.',
    },
  });

  const apartamento = await prisma.imovel.create({
    data: {
      titulo: 'Apartamento no Centro',
      tipo: 'APARTAMENTO',
      valor: 420000,
      cidade: 'Campinas',
      bairro: 'Centro',
      status: 'DISPONIVEL',
      descricao: 'Apartamento bem localizado.',
    },
  });

  await prisma.imovel.create({
    data: {
      titulo: 'Terreno comercial',
      tipo: 'TERRENO',
      valor: 300000,
      cidade: 'Valinhos',
      bairro: 'Vila Nova',
      status: 'RESERVADO',
      descricao: 'Terreno proximo a avenida principal.',
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        nome: 'Mariana Souza',
        email: 'mariana@email.com',
        telefone: '11999990001',
        origem: 'Site',
        status: 'NEGOCIACAO',
        observacoes: 'Gostou da casa e pediu proposta.',
        imovelId: casa.id,
      },
      {
        nome: 'Carlos Lima',
        email: 'carlos@email.com',
        telefone: '19999990002',
        origem: 'Indicacao',
        status: 'VISITA_AGENDADA',
        observacoes: 'Visita marcada para sabado.',
        imovelId: apartamento.id,
      },
      {
        nome: 'Ana Pereira',
        email: 'ana@email.com',
        telefone: '11999990003',
        origem: 'Instagram',
        status: 'NOVO',
        observacoes: 'Busca imovel ate 500 mil.',
      },
    ],
  });
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
