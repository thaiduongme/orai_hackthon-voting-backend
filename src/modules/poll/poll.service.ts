import { Injectable, BadRequestException } from '@nestjs/common';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { RPC_PROVIDER_ENDPOINT, CONTRACT_ADDRESS } from 'src/loaders/constants';
import { msg400 } from 'src/common/helpers/exception.msg';
import { request } from 'undici';
import { range } from 'rxjs';

@Injectable()
export class PollService {
  private async _getPollById(id: number): Promise<any> {
    const client = await cosmwasm.SigningCosmWasmClient.connect(
      RPC_PROVIDER_ENDPOINT,
    );
    const payload = { poll: { poll_id: id } };
    const currentPoll = await client.queryContractSmart(
      CONTRACT_ADDRESS,
      payload,
    );
    currentPoll['poll_id'] = id;
    return currentPoll;
  }

  private async _getTotalPollNumber(): Promise<any> {
    const client = await cosmwasm.SigningCosmWasmClient.connect(
      RPC_PROVIDER_ENDPOINT,
    );
    const payload = { config: {} };

    return (await client.queryContractSmart(CONTRACT_ADDRESS, payload))[
      'poll_count'
    ];
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

  async _getPolls(pollIds: number[]) {
    let result = [];
    const ids = [...pollIds];
    while (ids.length) {
      const current = await Promise.all(
        ids
          .splice(0, 10)
          .map(async (pollId) => await this._getPollById(pollId)),
      );
      result = Array.prototype.concat(...current, ...result);
    }
    return result;
  }

  async getVotedPolls(walletAddress: string): Promise<any> {
    let result = [];
    // Get all transactions of this wallet
    let flag = true;
    let limit = 100;
    let page_id = 1;
    const pollIds: number[] = [];
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
            pollIds.push(tx.messages[0].msg.cast_vote.poll_id);
          }
        }
        page_id += 1;
      }
    } while (flag);
    result = await this._getPolls(pollIds);
    // if (result.length === 0) {
    //   throw new BadRequestException(
    //     msg400(
    //       'An error occurred while getting vote polls of this wallet address',
    //     ),
    //   );
    // }
    return result;
  }

  async getAllPolls() {
    try {
      const totalPollNumber = await this._getTotalPollNumber();
      const pollIds = Array.from({ length: totalPollNumber }, (_, i) => i + 1);
      let result = await this._getPolls(pollIds);
      return result;
    } catch (err) {
      throw new BadRequestException(
        msg400(
          'An error occcured while trying to get polls create by a wallet',
          err.message,
        ),
      );
    }
  }

  async getPollsCreatedByWallet(walletAddress: string) {
    try {
      const result = [];
      const allPolls = await this.getAllPolls();
      for (let poll of allPolls) {
        if (poll['creator'] == walletAddress) {
          result.push(poll);
        }
      }
      return result;
    } catch (err) {
      throw new BadRequestException(
        msg400(
          'An error occcured while trying to get polls create by a wallet',
          err.message,
        ),
      );
    }
  }

  async getStartEndHeight(duration: number) {
    try {
      const response = await request(
        `https://api.testnet.scan.orai.io/v1/status`,
      );
      const responseJson = await response.body.json();
      const avgTime = responseJson['block_time'] / 60;
      const start_height = responseJson['latest_block_height'];
      const end_height = start_height + Math.ceil(duration / avgTime);

      return {
        start_height,
        end_height,
      };
    } catch (err) {
      throw new BadRequestException(
        msg400(
          'An error occcured while trying to get start, end height from duration (h)',
          err.message,
        ),
      );
    }
  }
}
