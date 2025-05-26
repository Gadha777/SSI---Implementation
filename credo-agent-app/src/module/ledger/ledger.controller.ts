import { Body, Controller, Post } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterCredDefDto } from './dto/register-cred-def.dto';

@ApiTags('ledger')
@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerservice: LedgerService) {}

  @Post('register-schema')
  @ApiOperation({ summary: 'Register schema' })
  async registerSchema() {
    return this.ledgerservice.registerSchema();
  }

  @Post('register-cred-def')
  @ApiOperation({ summary: 'Register Creddential definition' })
  async registerCredentialDefinition(@Body() dto: RegisterCredDefDto) {
    return this.ledgerservice.registerCredentialDefinition(dto);
  }
}
