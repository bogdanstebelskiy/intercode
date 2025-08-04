import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIsAlive(): object {
    return { content: "I'm alive!" };
  }
}
