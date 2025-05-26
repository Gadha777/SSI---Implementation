import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IssueCredentialDto } from './dto/credential';
// import {
//   OpenId4VcVerificationSessionState,
//   OpenId4VcVerificationSessionStateChangedEvent,
//   OpenId4VcVerifierEvents,
// } from '@credo-ts/openid4vc';
import {
  Agent,
  CredentialEventTypes,
  CredentialExchangeRecord,
  CredentialState,
  CredentialStateChangedEvent,
} from '@credo-ts/core';
import { AcmeService } from '../AcmeAgent/acme.service';
import { BobService } from '../BobAgent/bob.service';

@Injectable()
export class CredentialService {
  logger: any;
  agent: any;
  constructor(
    private readonly acmeservice: AcmeService,
    private readonly bobservice: BobService,
  ) {}

  async IssuingCredential(dto: IssueCredentialDto) {
    const agent = this.acmeservice.getAgent();

    if (!agent) {
      throw new BadRequestException('Agent not initialized yet!');
    }

    try {
      const record = await agent.credentials.offerCredential({
        protocolVersion: 'v2' as never,
        connectionId: dto.connectionId,
        credentialFormats: {
          indy: {
            credentialDefinitionId: dto.credentialDefinitionId,
            attributes: dto.attributes, // Must be [{ name: string, value: string }]
          },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Credential offer sent successfully',
        data: record,
      };
    } catch (error) {
      console.error(
        'Credential issuance error:',
        JSON.stringify(error, null, 2),
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to issue credential',
          error: error?.message || error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async acceptCredential(connectionId: string) {
    try {
      if (!connectionId) {
        throw new NotFoundException('connectionId is required');
      }
      const agent: Agent = this.bobservice.getAgent();

      const allCreds = await agent.credentials.getAll();

      console.log(
        'All credentials:',
        allCreds.map((c) => ({
          id: c.id,
          connectionId: c.connectionId,
          threadId: c.threadId,
          state: c.state,
        })),
      );

      const credentials = await agent.credentials.findAllByQuery({
        connectionId,
      });

      const offerCredential = credentials.find(
        (cred) => cred.state === CredentialState.OfferReceived,
      );

      if (!offerCredential) {
        throw new NotFoundException(
          `No credential offer found for connectionId: ${connectionId}`,
        );
      }

      const accepted = await agent.credentials.acceptOffer({
        credentialRecordId: offerCredential.id,
      });

      return {
        message: 'Credential offer accepted successfully',
        credentialId: accepted.id,
      };
    } catch (error) {
      console.error('Error accepting credential:', error);

      throw new InternalServerErrorException(
        `Failed to accept credential: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async getRecordofAcme(recordId: string): Promise<unknown> {
    try {
      const agent = this.acmeservice.getAgent();
      const offerRecord = await agent.credentials.getById(recordId);
      return offerRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in getting the record');
    }
  }

  async getRecordofBob(recordId: string): Promise<unknown> {
    try {
      const agent = this.bobservice.getAgent();
      const offerRecord = await agent.credentials.getById(recordId);
      return offerRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in getting the record');
    }
  }
}

