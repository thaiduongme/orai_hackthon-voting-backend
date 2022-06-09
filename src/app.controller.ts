import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    // This is your rpc endpoint
    const rpcEndpoint = 'https://testnet-rpc.orai.io/';

    // This is your contract address
    const contractAddr = 'orai1pv6vj4ljghu9e083ajacfe6rl0gg36vrjsh2lt';

    const client = await cosmwasm.SigningCosmWasmClient.connect(rpcEndpoint);
    const data = { poll: { poll_id: 1 } };

    const config = await client.queryContractSmart(contractAddr, data);
    return config;
  }
}
