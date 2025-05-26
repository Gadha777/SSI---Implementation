import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { AcmeModule } from '../AcmeAgent/acme.module';
import { BobModule } from '../BobAgent/bob.module';

@Module({
  imports: [BobModule, AcmeModule],
  providers: [ConnectionService],
  exports: [ConnectionService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
