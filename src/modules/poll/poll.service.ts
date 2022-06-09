import { Injectable, BadRequestException } from '@nestjs/common';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { RPC_PROVIDER_ENDPOINT, CONTRACT_ADDRESS } from 'src/loaders/constants';
import { msg400 } from 'src/common/helpers/exception.msg';

@Injectable()
export class PollService {
  async checkStatus(id: number): Promise<any> {
    try {
      const client = await cosmwasm.SigningCosmWasmClient.connect(
        RPC_PROVIDER_ENDPOINT,
      );
      const payload = { poll: { poll_id: id } };

      const result = await client.queryContractSmart(CONTRACT_ADDRESS, payload);
      return {
        status: 'success',
        pollStatus: result.status,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        msg400(
          'An error occured while querying to smart contract',
          err.message,
        ),
      );
    }
  }
}
