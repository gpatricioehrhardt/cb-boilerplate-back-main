import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  @Get()
  check() {
    return {
      status: 'ok',
    };
  }
}
