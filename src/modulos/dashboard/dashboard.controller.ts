import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../comum/guards/jwt.guard';
import { ServicoDashboard } from './dashboard.service';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class ControladorDashboard {
  constructor(private readonly dashboard: ServicoDashboard) {}

  @Get('resumo')
  resumo() {
    return this.dashboard.resumo();
  }
}
