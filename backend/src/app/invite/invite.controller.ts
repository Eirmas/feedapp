import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
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
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { IsPollOwnerGuard } from '../../common/guards/is-poll-owner.guard';
import { InviteEntity } from '../../models';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { CreateInviteDto } from './dto/create-invite.dto';
import { DeleteInviteDto } from './dto/delete-invite.dto';
import { InviteService } from './invite.service';

@ApiTags('FeedApp Invites')
@Controller('invites')
@UseInterceptors(ClassSerializerInterceptor)
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post(':pollId')
  @UseGuards(IsPollOwnerGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @ApiBody({ type: CreateInviteDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: InviteEntity })
  public createInvite(
    @Param('pollId', new ParseUUIDPipe()) pollId: string,
    @Body() createInviteDto: CreateInviteDto,
  ): Promise<InviteEntity> {
    return lastValueFrom(
      this.inviteService.createInvite(pollId, createInviteDto.email).pipe(
        catchError(err => {
          if (err instanceof ResourceExistsException) {
            throw new ConflictException(err.message);
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
  @ApiBody({ type: DeleteInviteDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deletePoll(@Param('pollId', new ParseUUIDPipe()) pollId: string, @Body() deleteInviteDto: DeleteInviteDto): Promise<DeleteResult> {
    return lastValueFrom(
      this.inviteService.deleteInvite(pollId, deleteInviteDto.email).pipe(
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
