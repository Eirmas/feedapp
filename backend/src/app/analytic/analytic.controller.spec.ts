import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { Analytic } from '../../models/analytic.schema';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';

describe('AnalyticController', () => {
  let analyticController: AnalyticController;
  const analyticService: MockProxy<AnalyticService> = mock<AnalyticService>();

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [AnalyticController],
      providers: [{ provide: AnalyticService, useValue: analyticService }],
    }).compile();

    analyticController = app.get<AnalyticController>(AnalyticController);
  });

  afterEach(() => {
    mockClear(analyticService);
  });

  it('should be defined', async () => {
    expect(analyticController).toBeDefined();
    expect(analyticService).toBeDefined();
  });

  describe('GET Analytics', () => {
    it('should return analytic', done => {
      const analytic = {} as PageDto<Analytic>;
      const pageOptionsDto = new PageOptionsDto();
      analyticService.getAnalytics.mockReturnValue(of(analytic));

      analyticController.getAnalytics(pageOptionsDto).then(response => {
        expect(response).toBe(analytic);
        done();
      });
    });

    it('should throw BadRequestException', done => {
      const pageOptionsDto = new PageOptionsDto();
      analyticService.getAnalytics.mockReturnValue(throwError(() => new Error('error')));

      analyticController.getAnalytics(pageOptionsDto).catch(error => {
        expect(error.message).toBe('error');
        expect(error).toBeInstanceOf(BadRequestException);
        done();
      });
    });
  });

  describe('GET Analytic by poll', () => {
    it('should return analytic', done => {
      const analytic = {} as Analytic;
      analyticService.getAnalyticById.mockReturnValue(of(analytic));

      analyticController.getAnalyticByPoll('pollId').then(response => {
        expect(response).toBe(analytic);
        done();
      });
    });

    it('should throw BadRequestException', done => {
      analyticService.getAnalyticById.mockReturnValue(throwError(() => new Error('error')));

      analyticController.getAnalyticByPoll('pollId').catch(error => {
        expect(error.message).toBe('error');
        expect(error).toBeInstanceOf(BadRequestException);
        done();
      });
    });

    it('should throw NotFoundException', done => {
      analyticService.getAnalyticById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      analyticController.getAnalyticByPoll('pollId').catch(error => {
        expect(error.message).toBe('error');
        expect(error).toBeInstanceOf(NotFoundException);
        done();
      });
    });
  });
});
