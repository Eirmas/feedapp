import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { Analytic } from '../../models/analytic.schema';
import { PollDomainModel } from 'domain-models';
import { Model } from 'mongoose';
import { Observable, from, tap } from 'rxjs';

@Injectable()
export class AnalyticService {
  constructor(@InjectModel(Analytic.name) private analyticModel: Model<Analytic>) {}

  public createAnalytic(poll: PollDomainModel, yes: number, no: number): Observable<Analytic> {
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
  public getAnalytics(): Observable<Analytic[]> {
    return from(this.analyticModel.find({}).lean().exec()).pipe();
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
