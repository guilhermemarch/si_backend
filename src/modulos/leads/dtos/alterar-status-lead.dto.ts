import { StatusLead } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class DtoAlterarStatusLead {
  @IsEnum(StatusLead)
  status: StatusLead;
}
