import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiSecure } from './auth/decorators/api-secure.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @ApiSecure()
  test(): string {
    return 'asdf';
  }
}
