import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'OK',
      message: 'Geo Ranker Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }

  @Get('health')
  getHealthCheck() {
    return {
      status: 'OK',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}