import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { RatingService } from './rating.service';
import { Rating } from './entities/rating.entity';
import { RatingController } from './rating.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, Rating])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
