import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioToken } from '../tipos/usuario-token';

export const UsuarioAtual = createParamDecorator(
  (_dado: unknown, contexto: ExecutionContext): UsuarioToken => {
    const requisicao = contexto.switchToHttp().getRequest();
    return requisicao.user;
  },
);
