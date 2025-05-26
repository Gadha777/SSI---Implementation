import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { AcmeModule } from '../AcmeAgent/acme.module';
import { BobService } from '../BobAgent/bob.service';

@Module({
  imports: [AcmeModule],
  providers: [BobService, LedgerService],
  controllers: [LedgerController],
})
export class ledgerModule {}
