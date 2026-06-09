import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ServicoUsuarios } from '../usuarios/usuarios.service';
import { DtoCadastro } from './dtos/cadastro.dto';
import { DtoLogin } from './dtos/login.dto';

@Injectable()
export class ServicoAutenticacao {
  constructor(
    private readonly usuarios: ServicoUsuarios,
    private readonly jwt: JwtService,
  ) {}

  async cadastrar(dados: DtoCadastro) {
    const email = dados.email.toLowerCase().trim();
    const usuarioExistente = await this.usuarios.buscarPorEmail(email);

    if (usuarioExistente) {
      throw new ConflictException('Email ja cadastrado');
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);
    const usuario = await this.usuarios.criar({
      nome: dados.nome.trim(),
      email,
      senhaHash,
    });

    return this.montarResposta(usuario);
  }

  async login(dados: DtoLogin) {
    const email = dados.email.toLowerCase().trim();
    const usuario = await this.usuarios.buscarPorEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const senhaValida = await bcrypt.compare(dados.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    return this.montarResposta(usuario);
  }

  async buscarUsuarioAutenticado(id: string) {
    const usuario = await this.usuarios.buscarPorId(id);

    if (!usuario) {
      throw new UnauthorizedException('Usuario nao encontrado');
    }

    return this.semSenha(usuario);
  }

  private async montarResposta(usuario: Usuario) {
    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    return {
      token,
      usuario: this.semSenha(usuario),
    };
  }

  private semSenha(usuario: Usuario) {
    const { senhaHash, ...dadosUsuario } = usuario;
    void senhaHash;
    return dadosUsuario;
  }
}
