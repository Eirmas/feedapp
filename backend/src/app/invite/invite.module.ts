import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../../common/guards/guard.module';
import { InviteEntity } from '../../models';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { PollModule } from '../poll/poll.module';

@Module({
  imports: [TypeOrmModule.forFeature([InviteEntity]), forwardRef(() => GuardModule), forwardRef(() => PollModule), ConfigModule],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
