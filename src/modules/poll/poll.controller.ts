import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { get } from 'http';
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

  @Get()
  async getAll() {
    return await this.pollService.getAllPolls();
  }

  @Get('created-by/:walletAddress')
  async getPollCreatedBy(@Param() params) {
    return await this.pollService.getPollsCreatedByWallet(params.walletAddress);
  }
}
