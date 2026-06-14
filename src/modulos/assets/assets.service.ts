import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';

const TIPOS_PERMITIDOS = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

@Injectable()
export class ServicoAssets {
  private client: S3Client | null = null;

  constructor(private readonly config: ConfigService) {}

  private obterCliente(): S3Client {
    if (this.client) return this.client;

    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const accessKeyId = this.config.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('S3_SECRET_ACCESS_KEY');
    const region = this.config.get<string>('S3_REGION') ?? 'auto';

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new NotFoundException('Armazenamento S3 não configurado');
    }

    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });

    return this.client;
  }

  private extensaoPorTipo(contentType: string): string {
    if (contentType === 'image/jpeg') return 'jpg';
    if (contentType === 'image/png') return 'png';
    if (contentType === 'image/webp') return 'webp';
    if (contentType === 'image/gif') return 'gif';
    return 'jpg';
  }

  private montarUrlPublica(arquivo: string): string {
    const base = (
      this.config.get<string>('IMOVEIS_ASSETS_BASE_URL') ??
      this.config.get<string>('S3_PUBLIC_URL_BASE') ??
      'http://localhost:3001/assets'
    ).replace(/\/$/, '');

    return `${base}/imoveis/images/${arquivo}`;
  }

  async buscarImagem(
    arquivo: string,
  ): Promise<{ stream: Readable; contentType: string }> {
    const bucket = this.config.get<string>('S3_BUCKET');
    if (!bucket) throw new NotFoundException('Bucket S3 não configurado');

    const key = `imoveis/images/${arquivo}`;

    try {
      const resposta = await this.obterCliente().send(
        new GetObjectCommand({ Bucket: bucket, Key: key }),
      );

      if (!resposta.Body) throw new NotFoundException('Imagem não encontrada');

      return {
        stream: resposta.Body as Readable,
        contentType: resposta.ContentType ?? 'application/octet-stream',
      };
    } catch {
      throw new NotFoundException('Imagem não encontrada');
    }
  }

  async enviarImagem(
    arquivo: Buffer,
    contentType: string,
    nomeOriginal?: string,
  ): Promise<{ url: string }> {
    const bucket = this.config.get<string>('S3_BUCKET');
    if (!bucket) throw new NotFoundException('Bucket S3 não configurado');

    if (!TIPOS_PERMITIDOS.has(contentType)) {
      throw new BadRequestException(
        'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.',
      );
    }

    if (arquivo.length > TAMANHO_MAXIMO) {
      throw new BadRequestException('Arquivo muito grande. Máximo 5 MB.');
    }

    const extensao =
      nomeOriginal?.match(/\.(jpe?g|png|webp|gif)$/i)?.[1]?.toLowerCase() ??
      this.extensaoPorTipo(contentType);
    const nomeArquivo = `${randomUUID()}.${extensao}`;
    const key = `imoveis/images/${nomeArquivo}`;

    await this.obterCliente().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: arquivo,
        ContentType: contentType,
      }),
    );

    return { url: this.montarUrlPublica(nomeArquivo) };
  }
}
