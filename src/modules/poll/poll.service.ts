import { Injectable, BadRequestException } from '@nestjs/common';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { RPC_PROVIDER_ENDPOINT, CONTRACT_ADDRESS } from 'src/loaders/constants';
import { msg400 } from 'src/common/helpers/exception.msg';
import { request } from 'undici';

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

  async getVotedPolls(walletAddress: string): Promise<any> {
    const result = [];
    // Get all transactions of this wallet
    let flag = true;
    let limit = 100;
    let page_id = 1;
    do {
      const response = await request(
        `https://api.testnet.scan.orai.io/v1/txs-account/${walletAddress}?limit=${limit}&page_id=${page_id}`,
      );
      const responseJson = await response.body.json();

      if (!responseJson.data) {
        flag = false;
      } else {
        for (const tx of responseJson.data) {
          if (
            tx.result == 'Success' &&
            tx.messages[0].contract == CONTRACT_ADDRESS &&
            tx.messages[0].msg.cast_vote
          ) {
            result.push(
              await this._getPollById(tx.messages[0].msg.cast_vote.poll_id),
            );
          }
        }
        page_id += 1;
      }
    } while (flag);
    return result;

    // Get transaction contains poll_id and has that smart-contract address
  }
}
