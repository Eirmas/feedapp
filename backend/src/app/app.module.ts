import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../common/config/app-conf';
import entities from '../models';
import { AnalyticModule } from './analytic/analytic.module';
import { HealthModule } from './health/health.module';
import { InviteModule } from './invite/invite.module';
import { PollModule } from './poll/poll.module';
import { RmqModule } from './rmq/rmq.module';
import { UserModule } from './user/user.module';
import { VoteModule } from './vote/vote.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    HealthModule,
    UserModule,
    PollModule,
    InviteModule,
    RmqModule,
    DeviceModule,
    VoteModule,
    AnalyticModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ConfigType<typeof appConfig>>('appConfig');
        const { username, password, cluster, database } = config.mongo;

        return {
          uri: `mongodb+srv://${username}:${password}@${cluster}.s4cto5g.mongodb.net/${database}?retryWrites=true&w=majority`,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ConfigType<typeof appConfig>>('appConfig');

        return {
          type: 'postgres',
          host: config.database.host,
          port: config.database.port,
          username: config.database.user,
          password: config.database.password,
          database: config.database.database,
          entities: entities,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
