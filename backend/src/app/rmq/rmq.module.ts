import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from '../../common/config/app-conf';
import { RmqService } from './rmq.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
          const { url, queue } = config.get<ConfigType<typeof appConfig>>('appConfig').rabbitmq;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queue,
              persistent: true,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {}
