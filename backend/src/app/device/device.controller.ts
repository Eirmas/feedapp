import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import ResourceNotConnectedException from '../../common/exceptions/device-not-connected.exception';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { AuthGuard } from '../../common/guards/auth.guard';
import { HasPollAccessGuard } from '../../common/guards/has-poll-access.guard';
import { IsDeviceGuard } from '../../common/guards/is-device.guard';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { CreateVoteDto } from '../vote/dto/create-vote.dto';
import { AggregatedVotes } from '../vote/vote.controller';
import { DeviceService } from './device.service';

@ApiTags('Devices')
@Controller('devices')
@UseInterceptors(ClassSerializerInterceptor)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: String, description: 'Returns a JWT token to be used by the device for future requests' })
  public createPoll(): Promise<string> {
    return lastValueFrom(
      this.deviceService.createDevice().pipe(
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Put('connect/:pollId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, IsDeviceGuard, HasPollAccessGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public connectPoll(
    @AccessToken() accessToken: AccessTokenData,
    @Param('pollId', new ParseUUIDPipe()) pollId: string,
  ): Promise<UpdateResult> {
    return lastValueFrom(
      this.deviceService.connectDevice(accessToken.sub, pollId).pipe(
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Post('vote')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, IsDeviceGuard)
  @ApiBody({ type: CreateVoteDto })
  @HttpCode(HttpStatus.CREATED)
  public createVote(@AccessToken() accessToken: AccessTokenData, @Body() createVoteDto: CreateVoteDto): Promise<AggregatedVotes> {
    return lastValueFrom(
      this.deviceService.vote(accessToken.sub, createVoteDto.answer).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          if (err instanceof ResourceNotConnectedException) {
            throw new BadRequestException('device_not_connected', err.message);
          }

          if (err instanceof ResourceClosedException) {
            throw new BadRequestException('poll_closed', err.message);
          }

          if (err instanceof ResourcePermissionDeniedException) {
            throw new ForbiddenException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
