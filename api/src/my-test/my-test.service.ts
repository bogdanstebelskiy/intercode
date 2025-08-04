import { Injectable } from '@nestjs/common';

@Injectable()
export class MyTestService {
  getIsAlive(): object {
    return { content: "I'm alive!" };
  }
}
