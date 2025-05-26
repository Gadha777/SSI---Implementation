import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Agent, OutOfBandInvitation } from '@credo-ts/core';
import { AcmeService } from '../AcmeAgent/acme.service';
import { BobService } from '../BobAgent/bob.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly bobService: BobService,
    private readonly acmeService: AcmeService,
  ) {}
  async createInvitation() {
    try {
      const agent: Agent = this.acmeService.getAgent();
      if (!agent) {
        throw new Error(
          'Agent not initialized.initialize the Acme Agent first.',
        );
      }
      const outOfBandRecord = await agent.oob.createInvitation();
      const oobId = outOfBandRecord.id;
      const invitation = outOfBandRecord.outOfBandInvitation.toUrl({
        domain: 'http://localhost:3001',
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Invitation created successfully.',
        invitationUrl: invitation,
        outOfBandRecord,
        oobId,
      };
    } catch (error) {
      console.log('Error creating invitation:', error);
      throw new InternalServerErrorException(
        `Failed to create invitation: ${error.message}`,
      );
    }
  }

  async receiveInvitation(invitationUrl: string) {
    try {
      const agent = this.bobService.getAgent();
      if (!agent) throw new Error('Agent is not initialized');
      if (typeof invitationUrl !== 'string') {
        throw new Error('Invitation URL must be a string');
      }
      const invitation = OutOfBandInvitation.fromUrl(invitationUrl);
      const { outOfBandRecord } = await agent.oob.receiveInvitation(invitation);
      const oobId = outOfBandRecord.id;

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Invitation received succcessfully',
        data: outOfBandRecord,
        oobId,
      };
    } catch (error) {
      console.log('Error receiving invitation:', error);
      throw new InternalServerErrorException(
        `Failed to receive invitation: ${error.message}`,
      );
    }
  }

  async getConnectionIdAcme(oobId: string) {
    try {
      const agent = this.acmeService.getAgent();

      const connections = await agent.connections.findAllByOutOfBandId(oobId);
      if (!connections.length) {
        throw new BadRequestException(
          `No connection found for out-of-band ID: ${oobId}`,
        );
      }
      const connectedConnection = await agent.connections.returnWhenIsConnected(
        connections[0].id,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Connection ID for agent return sucessfully',
        connectionId: connectedConnection.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to return the Connection ID',
      );
    }
  }

  async getConnectionIdBob(oobId: string) {
    try {
      const agent = this.bobService.getAgent();

      const connections = await agent.connections.findAllByOutOfBandId(oobId);
      if (!connections.length) {
        throw new BadRequestException(
          `No connection found for out-of-band ID: ${oobId}`,
        );
      }
      const connectedConnection = await agent.connections.returnWhenIsConnected(
        connections[0].id,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Connection ID for agent return sucessfully',
        connectionId: connectedConnection.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to return the Connection ID',
      );
    }
  }
}
