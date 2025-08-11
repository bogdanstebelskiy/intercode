import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../recipe/entities/recipe.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async rateRecipe(userId: string, recipeId: string, dto: CreateRatingDto) {
    const { value } = dto;

    if (value < 1 || value > 5) {
      throw new BadRequestException('Value must be 1-5');
    }

    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const recipe = await this.recipeRepository.findOneByOrFail({
      id: recipeId,
    });

    await this.ratingRepository.upsert(
      {
        user: user,
        recipe: recipe,
        value,
      },
      ['userId', 'recipeId'],
    );

    const rating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, recipe: { id: recipeId } },
    });

    return rating;
  }
}
