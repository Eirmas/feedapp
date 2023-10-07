import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly helloService: HealthService) {}

  @Get()
  getHealth(): string {
    return this.helloService.getHealth();
  }
}
