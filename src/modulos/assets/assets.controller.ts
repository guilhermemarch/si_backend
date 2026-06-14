import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PerfilUsuario } from '@prisma/client';
import type { Response } from 'express';
import { Roles } from '../../comum/decorators/roles.decorator';
import { JwtGuard } from '../../comum/guards/jwt.guard';
import { RolesGuard } from '../../comum/guards/roles.guard';
import { ServicoAssets } from './assets.service';

@Controller('assets')
export class ControladorAssets {
  constructor(private readonly assets: ServicoAssets) {}

  @Get('imoveis/images/:arquivo')
  async imagem(
    @Param('arquivo') arquivo: string,
    @Res({ passthrough: true }) resposta: Response,
  ) {
    const { stream, contentType } = await this.assets.buscarImagem(arquivo);
    resposta.setHeader('Cache-Control', 'public, max-age=86400');
    resposta.setHeader('Content-Type', contentType);
    return new StreamableFile(stream);
  }

  @Roles(PerfilUsuario.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('imoveis/upload')
  @UseInterceptors(FileInterceptor('arquivo'))
  async upload(
    @UploadedFile()
    arquivo?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
    },
  ) {
    if (!arquivo) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    return this.assets.enviarImagem(
      arquivo.buffer,
      arquivo.mimetype,
      arquivo.originalname,
    );
  }
}
