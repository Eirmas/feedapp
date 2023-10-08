import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from '../common/config/app-conf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import * as fs from 'fs';
import entities from '../models';

const getSSL = () => {
  let ssl = undefined;
  if (process.env.POSTGRES_USE_AWS === 'true') {
    ssl = {
      ca: fs.readFileSync('./certs/rds-combined-ca-bundle.pem').toString(),
      rejectUnauthorized: true,
    };
  }

  return ssl;
};

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ConfigType<typeof appConfig>>('appConfig');
        const ssl = getSSL();

        return {
          type: 'postgres',
          host: config.database.host,
          port: config.database.port,
          username: config.database.user,
          password: config.database.password,
          database: config.database.database,
          entities: entities,
          synchronize: true,
          ssl,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
