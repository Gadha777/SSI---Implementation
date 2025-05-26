import { Controller, Get, Post } from '@nestjs/common';
import { AcmeService } from './acme.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('Acme-Agent')
export class AcmeController {
  constructor(private readonly AcmeService: AcmeService) {}

  @Get('initialize-acme')
  @ApiOperation({ summary: 'Initialize the Acme agent' })
  async initializeAcmeAgent() {
    const agent = await this.AcmeService.initializeAcmeAgent();
    return {
      message: 'Acme agent initialized',
      agentdata: {
        label: agent.data.config.label,
        walletId: agent.data.config?.walletConfig?.id,
        endpoints: agent.data.config.endpoints,
      },
    };
  }
}
