import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(private readonly helloService: HealthService) {}

  @Get()
  @ApiOkResponse({ type: String })
  getHealth(): string {
    return this.helloService.getHealth();
  }
}
