import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BobService } from './bob.service';

@Controller('Bob-Agent')
export class BobController {
  constructor(private readonly bobService: BobService) {}

  @Get('initialize-bob')
  @ApiOperation({ summary: 'Initialize the Bob agent' })
  async initializeBobAgent() {
    const agent = await this.bobService.initializeBobAgent();
    return {
      message: 'Bob agent initialized',
      agentdata: {
        label: agent.data.config.label,
        walletId: agent.data.config?.walletConfig?.id,
        endpoints: agent.data.config.endpoints,
      },
    };
  }
}
