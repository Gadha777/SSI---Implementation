import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { AcmeModule } from '../AcmeAgent/acme.module';
import { BobModule } from '../BobAgent/bob.module';

@Module({
  imports: [AcmeModule, BobModule],
  controllers: [CredentialController],
  providers: [CredentialService],
})
export class CredentialModule {}
