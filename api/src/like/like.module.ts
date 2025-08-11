import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Like])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
