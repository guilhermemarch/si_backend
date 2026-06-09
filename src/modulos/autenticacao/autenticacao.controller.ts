import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsuarioAtual } from '../../comum/decorators/usuario-atual.decorator';
import { JwtGuard } from '../../comum/guards/jwt.guard';
import type { UsuarioToken } from '../../comum/tipos/usuario-token';
import { ServicoAutenticacao } from './autenticacao.service';
import { DtoCadastro } from './dtos/cadastro.dto';
import { DtoLogin } from './dtos/login.dto';

@Controller('auth')
export class ControladorAutenticacao {
  constructor(private readonly autenticacao: ServicoAutenticacao) {}

  @Post('cadastro')
  cadastrar(@Body() dados: DtoCadastro) {
    return this.autenticacao.cadastrar(dados);
  }

  @Post('login')
  login(@Body() dados: DtoLogin) {
    return this.autenticacao.login(dados);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@UsuarioAtual() usuario: UsuarioToken) {
    return this.autenticacao.buscarUsuarioAutenticado(usuario.sub);
  }
}
