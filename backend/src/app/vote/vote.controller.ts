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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { HasPollAccessGuard } from '../../common/guards/has-poll-access.guard';
import { VoteEntity } from '../../models';
import { catchError, lastValueFrom, take } from 'rxjs';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteService } from './vote.service';

@ApiTags('FeedApp Votes')
@Controller('votes')
@UseInterceptors(ClassSerializerInterceptor)
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get(':pollId')
  @UseGuards(HasPollAccessGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  public getVotesByPoll(@Param('pollId', new ParseUUIDPipe()) pollId: string): Promise<{ yes: number; no: number }> {
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
  @HttpCode(HttpStatus.CREATED)
  public createVote(@Param('pollId', new ParseUUIDPipe()) pollId: string, @Body() createVoteDto: CreateVoteDto): Promise<VoteEntity> {
    return lastValueFrom(
      this.voteService.createVote(pollId, createVoteDto.answer).pipe(
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
}
