import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './module/connection/connection.module';
import { ledgerModule } from './module/ledger/ledger.module';
import { CredentialModule } from './module/credential/credential.module';
import { AcmeModule } from './module/AcmeAgent/acme.module';
import { BobModule } from './module/BobAgent/bob.module';

@Module({
  imports: [
    BobModule,
    AcmeModule,
    ConnectionModule,
    ledgerModule,
    CredentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
