import { Module } from '@nestjs/common';
import { BobController } from './bob.controller';
import { HttpModule } from '@nestjs/axios';
import { BobService } from './bob.service';

@Module({
  imports: [HttpModule],
  controllers: [BobController],
  providers: [BobService],
  exports: [BobService],
})
export class BobModule {}
