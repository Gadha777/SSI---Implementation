import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { AcceptCredentialByConnectionIdDto, GetRecordDto, IssueCredentialDto,  } from './dto/credential';
import { ApiOperation } from '@nestjs/swagger';

@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('issue-credentials')
  @ApiOperation({ summary: 'Issue a credential to a holder.' })
  async issueCredential(@Body() issueCredentialDto: IssueCredentialDto) {
    return this.credentialService.IssuingCredential(issueCredentialDto);
  }

  @Post('accept')
  @ApiOperation({ summary: 'Accept credential.' })
  async acceptCredential(@Body() dto: AcceptCredentialByConnectionIdDto) {
    return this.credentialService.acceptCredential(dto.connectionId);
  }

  @Post('record-Acme')
  @ApiOperation({ summary: ' get record of acme' })
  async getRecordacme(@Body() dto: GetRecordDto) {
    return this.credentialService.getRecordofAcme(dto.recordId);
  }

  @Post('record-Bob')
  @ApiOperation({ summary: ' get record of bob' })
  async getRecordbob(@Body() dto: GetRecordDto) {
    return this.credentialService.getRecordofBob(dto.recordId);
  }
}
