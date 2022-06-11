import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    return 'Shelby Family';
  }
}
