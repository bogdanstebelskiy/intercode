import { Controller, Get } from '@nestjs/common';

import { MyTestService } from './my-test.service';

@Controller('my-test')
export class MyTestController {
  constructor(private readonly myTestService: MyTestService) {}

  @Get()
  getIsAlive(): object {
    return this.myTestService.getIsAlive();
  }
}
