import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { Analytic } from '../../models/analytic.schema';
import { catchError, lastValueFrom, take } from 'rxjs';
import { AnalyticService } from './analytic.service';
import { PaginateDto } from '../../common/dto/paginate.dto';

@ApiTags('FeedApp Analytics')
@Controller('analytics')
@UseInterceptors(ClassSerializerInterceptor)
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  @ApiOkResponse({ type: Analytic, isArray: true })
  @ApiBody({ type: PaginateDto })
  public getAnalytics(@Body() pagination: PaginateDto): Promise<Analytic[]> {
    return lastValueFrom(
      this.analyticService.getAnalytics(pagination).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get(':pollId')
  @ApiParam({ name: 'pollId', format: 'uuid' })
  @ApiOkResponse({ type: Analytic })
  public getAnalyticByPoll(@Param('pollId', new ParseUUIDPipe()) pollId: string): Promise<Analytic> {
    return lastValueFrom(
      this.analyticService.getAnalyticById(pollId).pipe(
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
