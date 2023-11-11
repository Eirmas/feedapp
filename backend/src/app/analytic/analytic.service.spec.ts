import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { Model } from 'mongoose';
import { Analytic } from '../../models/analytic.schema';
import { AnalyticService } from './analytic.service';

describe('AnalyticService', () => {
  let analyticService: AnalyticService;
  const analyticRepository: MockProxy<Model<Analytic>> = mock<Model<Analytic>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [{ provide: getModelToken(Analytic.name), useValue: analyticRepository }, AnalyticService],
    }).compile();

    analyticService = module.get<AnalyticService>(AnalyticService);
  });

  afterEach(() => {
    mockClear(analyticRepository);
  });

  it('should be defined', async () => {
    expect(analyticService).toBeDefined();
    expect(analyticRepository).toBeDefined();
  });
});
