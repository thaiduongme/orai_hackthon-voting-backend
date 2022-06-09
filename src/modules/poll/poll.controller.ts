import { Controller, Get, Param } from '@nestjs/common';
import { StatusRequest } from './dto/request.dto';
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Get('status/:id')
  async checkStatus(@Param() params: StatusRequest) {
    return await this.pollService.checkStatus(Number(params.id));
  }
}
