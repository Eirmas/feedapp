import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollModule } from '../../app/poll/poll.module';
import { UserModule } from '../../app/user/user.module';
import { AuthGuard } from './auth.guard';
import { HasPollAccessGuard } from './has-poll-access.guard';
import { IsDeviceGuard } from './is-device.guard';
import { IsPollOwnerGuard } from './is-poll-owner.guard';

@Module({
  imports: [PollModule, forwardRef(() => UserModule), ConfigModule],
  providers: [AuthGuard, IsPollOwnerGuard, HasPollAccessGuard, IsDeviceGuard],
  exports: [AuthGuard, IsPollOwnerGuard, HasPollAccessGuard, IsDeviceGuard],
})
export class GuardModule {}
