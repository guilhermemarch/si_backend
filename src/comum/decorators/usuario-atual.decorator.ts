import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioToken } from '../tipos/usuario-token';

type RequisicaoComUsuario = {
  user: UsuarioToken;
};

export const UsuarioAtual = createParamDecorator(
  (_dado: unknown, contexto: ExecutionContext): UsuarioToken => {
    const requisicao = contexto
      .switchToHttp()
      .getRequest<RequisicaoComUsuario>();
    return requisicao.user;
  },
);
