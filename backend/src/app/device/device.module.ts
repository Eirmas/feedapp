import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardModule } from '../../common/guards/guard.module';
import { DeviceEntity } from '../../models';
import { PollModule } from '../poll/poll.module';
import { VoteModule } from '../vote/vote.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    forwardRef(() => GuardModule),
    forwardRef(() => PollModule),
    forwardRef(() => VoteModule),
    ConfigModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
