import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { Analytic } from '../../models/analytic.schema';
import { Model } from 'mongoose';
import { Observable, combineLatest, from, map, tap } from 'rxjs';
import { PollEntity } from '../../models';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';

@Injectable()
export class AnalyticService {
  constructor(@InjectModel(Analytic.name) private analyticModel: Model<Analytic>) {}

  public createAnalytic(poll: PollEntity, yes: number, no: number): Observable<Analytic> {
    const createdAnalytic = new this.analyticModel({
      _id: poll.id,
      title: poll.title,
      question: poll.question,
      yes: yes,
      no: no,
      created: Date.now(),
    });

    return from(createdAnalytic.save());
  }

  public getAnalytics(pageOptionsDto: PageOptionsDto): Observable<PageDto<Analytic>> {
    const order = pageOptionsDto.order.toLocaleLowerCase() as 'asc' | 'desc';
    const dataQueryBuilder = this.analyticModel.find({}).sort({ created: order }).skip(pageOptionsDto.skip).limit(pageOptionsDto.take);
    const countQueryBuilder = this.analyticModel.find({});

    return combineLatest([countQueryBuilder.count().exec(), dataQueryBuilder.lean().exec()]).pipe(
      map(([itemCount, entities]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
      }),
    );
  }

  public getAnalyticById(id: string): Observable<Analytic> {
    return from(this.analyticModel.findById(id).lean().exec()).pipe(
      tap(analytic => {
        if (!analytic) {
          throw new ResourceNotFoundException(`Analytic with poll ID ${id} not found. Has it been closed?`);
        }
      }),
    );
  }
}
