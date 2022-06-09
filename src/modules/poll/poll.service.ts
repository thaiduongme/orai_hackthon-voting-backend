import { Injectable, BadRequestException } from '@nestjs/common';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { RPC_PROVIDER_ENDPOINT, CONTRACT_ADDRESS } from 'src/loaders/constants';
import { msg400 } from 'src/common/helpers/exception.msg';

@Injectable()
export class PollService {
  private async _getPollById(id: number): Promise<any> {
    const client = await cosmwasm.SigningCosmWasmClient.connect(
      RPC_PROVIDER_ENDPOINT,
    );
    const payload = { poll: { poll_id: id } };

    return await client.queryContractSmart(CONTRACT_ADDRESS, payload);
  }

  async getInfo(id: number): Promise<any> {
    try {
      const currentPoll = await this._getPollById(id);
      return {
        status: 'success',
        data: currentPoll,
      };
    } catch (err) {
      throw new BadRequestException(
        msg400('An error occured while getting poll info', err.message),
      );
    }
  }

  async checkStatus(id: number): Promise<any> {
    try {
      const currentPoll = await this._getPollById(id);
      return {
        status: 'success',
        pollStatus: currentPoll.status,
      };
    } catch (err) {
      throw new BadRequestException(
        msg400('An error occured while getting poll status', err.message),
      );
    }
  }
}
