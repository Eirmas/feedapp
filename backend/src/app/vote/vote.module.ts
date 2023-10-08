import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../../common/guards/guard.module';
import { VoteEntity } from '../../models';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { PollModule } from '../poll/poll.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteEntity]),
    forwardRef(() => GuardModule),
    forwardRef(() => PollModule),
    forwardRef(() => UserModule),
    ConfigModule,
  ],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
