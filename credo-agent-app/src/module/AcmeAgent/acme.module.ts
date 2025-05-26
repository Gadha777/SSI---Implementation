import { Module } from '@nestjs/common';
import { AcmeService } from './acme.service';
import { AcmeController } from './acme.controller';

@Module({
  controllers: [AcmeController],
  providers: [AcmeService],
  exports: [AcmeService],
})
export class AcmeModule {}
