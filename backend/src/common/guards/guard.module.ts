import { Module, forwardRef } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { PollModule } from '../../app/poll/poll.module';
import { IsPollOwnerGuard } from './is-poll-owner.guard';
import { HasPollAccessGuard } from './has-poll-access.guard';
import { UserModule } from '../../app/user/user.module';

@Module({
  imports: [PollModule, forwardRef(() => UserModule), ConfigModule],
  providers: [AuthGuard, IsPollOwnerGuard, HasPollAccessGuard],
  exports: [AuthGuard, IsPollOwnerGuard, HasPollAccessGuard],
})
export class GuardModule {}
