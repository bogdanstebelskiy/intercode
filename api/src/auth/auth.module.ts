import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserService } from '../user/user.service';
import { Recipe } from '../recipe/entities/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe, RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
