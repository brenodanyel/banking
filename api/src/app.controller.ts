import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController(true)
export class AppController {
  @Get()
  getHello() {
    return 'Hello World!';
  }
}
