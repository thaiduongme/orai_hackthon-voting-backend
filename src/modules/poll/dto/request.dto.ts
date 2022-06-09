import { IsNumberString } from 'class-validator';

export class StatusRequest {
  @IsNumberString()
  id: number;
}
