import { Module } from '@nestjs/common';
import { MyTestModule } from './my-test/my-test.module';

@Module({
  imports: [MyTestModule],
})
export class AppModule {}
