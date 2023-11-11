import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { HasPollAccessGuard } from '../../common/guards/has-poll-access.guard';
import { IsNotDeviceGuard } from '../../common/guards/is-not-device.guard';
import { PollIsOpenGuard } from '../../common/guards/poll-is-open.guard';
import { VoteEntity } from '../../models';
import { GetVotesDao } from './dao/get-votes.dao';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteService } from './vote.service';

export interface AggregatedVotes {
  yes: number;
  no: number;
}

@ApiTags('Votes')
@UseGuards(IsNotDeviceGuard)
@Controller('votes')
@UseInterceptors(ClassSerializerInterceptor)
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get(':pollId')
  @ApiBearerAuth()
  @UseGuards(HasPollAccessGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @ApiOkResponse({ type: GetVotesDao })
  public getVotesByPoll(@Param('pollId', new ParseUUIDPipe()) pollId: string): Promise<AggregatedVotes> {
    return lastValueFrom(
      this.voteService.getVotesByPoll(pollId).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Post(':pollId')
  @ApiBearerAuth()
  @UseGuards(HasPollAccessGuard, PollIsOpenGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @ApiBody({ type: CreateVoteDto })
  @HttpCode(HttpStatus.CREATED)
  public createVote(@Param('pollId', new ParseUUIDPipe()) pollId: string, @Body() createVoteDto: CreateVoteDto): Promise<VoteEntity> {
    return lastValueFrom(
      this.voteService.createVote(pollId, createVoteDto.answer).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          if (err instanceof ResourceClosedException) {
            throw new BadRequestException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
