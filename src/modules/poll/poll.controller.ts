import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StatusRequest } from './dto/request.dto';
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Get(':id')
  async getInfo(@Param() params: StatusRequest) {
    return await this.pollService.getInfo(Number(params.id));
  }

  @Get('status/:id')
  async checkStatus(@Param() params: StatusRequest) {
    return await this.pollService.checkStatus(Number(params.id));
  }

  @Get('wallet/:walletAddress')
  async getByWallet(@Param() params) {
    return await this.pollService.getVotedPolls(params.walletAddress);
  }
}
