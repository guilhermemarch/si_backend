import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsuarioToken } from '../tipos/usuario-token';

type RequisicaoComUsuario = {
  user?: UsuarioToken;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const perfis = this.reflector.getAllAndOverride<PerfilUsuario[]>(
      ROLES_KEY,
      [contexto.getHandler(), contexto.getClass()],
    );

    if (!perfis?.length) {
      return true;
    }

    const requisicao = contexto
      .switchToHttp()
      .getRequest<RequisicaoComUsuario>();
    const usuario = requisicao.user;

    if (!usuario?.perfil || !perfis.includes(usuario.perfil)) {
      throw new ForbiddenException(
        'Apenas administradores podem alterar dados',
      );
    }

    return true;
  }
}
