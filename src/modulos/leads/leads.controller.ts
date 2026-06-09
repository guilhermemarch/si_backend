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
import { DtoAlterarStatusLead } from './dtos/alterar-status-lead.dto';
import { DtoAtualizarLead } from './dtos/atualizar-lead.dto';
import { DtoCriarLead } from './dtos/criar-lead.dto';
import { DtoFiltroLeads } from './dtos/filtro-leads.dto';
import { ServicoLeads } from './leads.service';

@UseGuards(JwtGuard)
@Controller('leads')
export class ControladorLeads {
  constructor(private readonly leads: ServicoLeads) {}

  @Post()
  criar(@Body() dados: DtoCriarLead) {
    return this.leads.criar(dados);
  }

  @Get()
  listar(@Query() filtros: DtoFiltroLeads) {
    return this.leads.listar(filtros);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.leads.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: DtoAtualizarLead) {
    return this.leads.atualizar(id, dados);
  }

  @Patch(':id/status')
  alterarStatus(@Param('id') id: string, @Body() dados: DtoAlterarStatusLead) {
    return this.leads.alterarStatus(id, dados);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.leads.remover(id);
  }
}
