import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { RecipeService } from '../recipe/recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe])],
  controllers: [UserController],
  providers: [UserService, RecipeService],
})
export class UserModule {}
