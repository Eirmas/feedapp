import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Analytic } from '../../models/analytic.schema';
import { Observable } from 'rxjs';

@Injectable()
export class RmqService {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

  public closePoll(analytic: Analytic): Observable<void> {
    return this.client.emit('poll_closed', analytic);
  }
}
