import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytic, AnalyticSchema } from '../../models/analytic.schema';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Analytic.name, schema: AnalyticSchema }]), ConfigModule],
  controllers: [AnalyticController],
  providers: [AnalyticService],
  exports: [AnalyticService],
})
export class AnalyticModule {}
