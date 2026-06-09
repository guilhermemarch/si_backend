import { IsNotEmpty } from 'class-validator';

export class DtoConversaChatbot {
  @IsNotEmpty()
  mensagem: string;
}
