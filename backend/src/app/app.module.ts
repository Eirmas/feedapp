import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../common/config/app-conf';
import entities from '../models';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PollModule } from './poll/poll.module';
import { InviteModule } from './invite/invite.module';
import { VoteModule } from './vote/vote.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticModule } from './analytic/analytic.module';

@Module({
  imports: [
    HealthModule,
    UserModule,
    PollModule,
    InviteModule,
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
          synchronize: true,
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
