import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../comum/guards/jwt.guard';
import { DtoAtualizarImovel } from './dtos/atualizar-imovel.dto';
import { DtoCriarImovel } from './dtos/criar-imovel.dto';
import { DtoFiltroImoveis } from './dtos/filtro-imoveis.dto';
import { ServicoImoveis } from './imoveis.service';

@UseGuards(JwtGuard)
@Controller('imoveis')
export class ControladorImoveis {
  constructor(private readonly imoveis: ServicoImoveis) {}

  @Post()
  criar(@Body() dados: DtoCriarImovel) {
    return this.imoveis.criar(dados);
  }

  @Get()
  listar(@Query() filtros: DtoFiltroImoveis) {
    return this.imoveis.listar(filtros);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.imoveis.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: DtoAtualizarImovel) {
    return this.imoveis.atualizar(id, dados);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.imoveis.remover(id);
  }
}
