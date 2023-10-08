import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { Analytic } from '../../models/analytic.schema';
import { catchError, lastValueFrom, take } from 'rxjs';
import { AnalyticService } from './analytic.service';

@ApiTags('FeedApp Analytics')
@Controller('analytics')
@UseInterceptors(ClassSerializerInterceptor)
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  public getAnalytics(): Promise<Analytic[]> {
    return lastValueFrom(
      this.analyticService.getAnalytics().pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get(':pollId')
  @ApiParam({ name: 'pollId', format: 'uuid' })
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
