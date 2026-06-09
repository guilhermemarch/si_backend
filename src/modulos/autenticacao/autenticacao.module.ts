import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ModuloUsuarios } from '../usuarios/usuarios.module';
import { ControladorAutenticacao } from './autenticacao.controller';
import { ServicoAutenticacao } from './autenticacao.service';
import { EstrategiaJwt } from './estrategias/jwt.strategy';

@Module({
  imports: [
    ModuloUsuarios,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET') ?? 'segredo-local',
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '1d',
        } as JwtSignOptions,
      }),
    }),
  ],
  controllers: [ControladorAutenticacao],
  providers: [ServicoAutenticacao, EstrategiaJwt],
})
export class ModuloAutenticacao {}
