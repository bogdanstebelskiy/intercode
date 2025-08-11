import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async likeRecipe(userId: string, recipeId: string) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    const recipe = await this.recipeRepository.findOneByOrFail({
      id: recipeId,
    });

    const like = this.likeRepository.create({
      user,
      recipe,
    });

    try {
      const savedLike = await this.likeRepository.save(like);

      return {
        id: savedLike.id,
        userId: savedLike.user.id,
        recipeId: savedLike.recipe.id,
        createdAt: savedLike.createdAt,
      };
    } catch (error) {
      console.log('[ERROR IN LIKE SERVICE]: ' + error);
      throw new ConflictException('Already liked');
    }
  }

  async unlikeRecipe(userId: string, recipeId: string) {
    const result = await this.likeRepository.delete({
      user: { id: userId },
      recipe: { id: recipeId },
    });

    return { deleted: result.affected ?? 0 };
  }
}
