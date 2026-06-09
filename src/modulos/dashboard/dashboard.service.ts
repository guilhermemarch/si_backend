import { Injectable } from '@nestjs/common';
import { StatusLead } from '@prisma/client';
import { ServicoPrisma } from '../../prisma/prisma.service';

@Injectable()
export class ServicoDashboard {
  constructor(private readonly prisma: ServicoPrisma) {}

  async resumo() {
    const [totalLeads, totalImoveis, leadsPorStatus, imoveisDisponiveis] =
      await Promise.all([
        this.prisma.lead.count(),
        this.prisma.imovel.count(),
        this.prisma.lead.groupBy({ by: ['status'], _count: { status: true } }),
        this.prisma.imovel.count({ where: { status: 'DISPONIVEL' } }),
      ]);

    const totalLeadsPorStatus = Object.values(StatusLead).reduce(
      (resultado, status) => ({ ...resultado, [status]: 0 }),
      {} as Record<StatusLead, number>,
    );

    for (const item of leadsPorStatus) {
      totalLeadsPorStatus[item.status] = item._count.status;
    }

    return {
      totalLeads,
      totalImoveis,
      totalLeadsPorStatus,
      totalImoveisDisponiveis: imoveisDisponiveis,
      totalLeadsGanhos: totalLeadsPorStatus.GANHO,
      totalLeadsPerdidos: totalLeadsPorStatus.PERDIDO,
    };
  }
}
