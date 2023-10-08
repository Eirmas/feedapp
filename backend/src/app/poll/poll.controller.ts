import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { HasPollAccessGuard } from '../../common/guards/has-poll-access.guard';
import { IsPollOwnerGuard } from '../../common/guards/is-poll-owner.guard';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { PollEntity } from '../../models';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollService } from './poll.service';

@ApiTags('FeedApp Polls')
@Controller('polls')
@UseInterceptors(ClassSerializerInterceptor)
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public getPolls(@AccessToken() accessToken: AccessTokenData): Promise<PollEntity[]> {
    return lastValueFrom(
      this.pollService.getPollsByUser(accessToken.sub).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get(':pollId')
  @UseGuards(HasPollAccessGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  public getPollById(@Param('pollId', new ParseUUIDPipe()) pollId: string): Promise<PollEntity> {
    return lastValueFrom(
      this.pollService.getPollById(pollId).pipe(
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

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public createPoll(@AccessToken() accessToken: AccessTokenData, @Body() createPollDto: CreatePollDto): Promise<PollEntity> {
    return lastValueFrom(
      this.pollService.createPoll(accessToken.sub, createPollDto).pipe(
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Put(':pollId/close')
  @ApiBearerAuth()
  @UseGuards(IsPollOwnerGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  public closePoll(@Param('pollId', new ParseUUIDPipe()) pollId: string): Promise<UpdateResult> {
    return lastValueFrom(
      this.pollService.closePoll(pollId).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Put(':pollId')
  @ApiBearerAuth()
  @UseGuards(IsPollOwnerGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updatePoll(@Param('pollId', new ParseUUIDPipe()) pollId: string, @Body() updatePollDto: UpdatePollDto): Promise<UpdateResult> {
    return lastValueFrom(
      this.pollService.updatePoll(pollId, updatePollDto).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Delete(':pollId')
  @ApiBearerAuth()
  @UseGuards(IsPollOwnerGuard)
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deletePoll(@Param('pollId', new ParseUUIDPipe()) pollId: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.pollService.deletePoll(pollId).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }
}
