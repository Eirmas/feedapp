import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../../common/guards/guard.module';
import { PollEntity } from '../../models';
import { AnalyticModule } from '../analytic/analytic.module';
import { UserModule } from '../user/user.module';
import { VoteModule } from '../vote/vote.module';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PollEntity]),
    forwardRef(() => GuardModule),
    forwardRef(() => UserModule),
    forwardRef(() => VoteModule),
    forwardRef(() => AnalyticModule),
    ConfigModule,
  ],
  controllers: [PollController],
  providers: [PollService],
  exports: [PollService],
})
export class PollModule {}
