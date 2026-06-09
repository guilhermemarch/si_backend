import { Injectable } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { ServicoPrisma } from '../../prisma/prisma.service';

type DadosCriacaoUsuario = {
  nome: string;
  email: string;
  senhaHash: string;
  perfil?: PerfilUsuario;
};

@Injectable()
export class ServicoUsuarios {
  constructor(private readonly prisma: ServicoPrisma) {}

  criar(dados: DadosCriacaoUsuario) {
    return this.prisma.usuario.create({ data: dados });
  }

  buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  buscarPorId(id: string) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }
}
