import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockClear } from 'jest-mock-extended';
import { RmqService } from './rmq.service';
import { Analytic } from '../../models/analytic.schema';
import { of } from 'rxjs';

describe('RmqService', () => {
  let rmqService: RmqService;
  const client = mock<ClientProxy>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [{ provide: 'RABBITMQ_SERVICE', useValue: client }, RmqService],
    }).compile();

    rmqService = module.get<RmqService>(RmqService);
  });

  afterEach(() => {
    mockClear(client);
  });

  it('should be defined', async () => {
    expect(rmqService).toBeDefined();
    expect(client).toBeDefined();
  });

  describe('closePoll', () => {
    it('should send a message to the queue', done => {
      client.emit.mockReturnValueOnce(of(undefined));
      const analytic = {} as Analytic;

      rmqService.closePoll(analytic).subscribe(() => {
        expect(client.emit).toBeCalledWith('poll_closed', analytic);
        done();
      });
    });
  });
});
