import { PerfilUsuario } from '@prisma/client';

export type UsuarioToken = {
  sub: string;
  email: string;
  perfil: PerfilUsuario;
};
