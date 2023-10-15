import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { catchError, lastValueFrom, take } from 'rxjs';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { Analytic } from '../../models/analytic.schema';
import { AnalyticService } from './analytic.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseInterceptors(ClassSerializerInterceptor)
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  @ApiOkResponsePaginated(Analytic)
  public getAnalytics(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Analytic>> {
    return lastValueFrom(
      this.analyticService.getAnalytics(pageOptionsDto).pipe(
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
