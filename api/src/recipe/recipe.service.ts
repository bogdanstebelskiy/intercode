import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FilterRecipesDto } from './dto/filter-recipes.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    console.log('DTO received in service: ', createRecipeDto);
    const newRecipe = this.recipeRepository.create(createRecipeDto);

    return await this.recipeRepository.save(newRecipe);
  }

  async findAll(): Promise<Recipe[]> {
    return await this.recipeRepository.find();
  }

  async findWithUserData(recipeId: string, userId: string) {
    const recipe = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect(
        'recipe.ratings',
        'rating',
        'rating.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('recipe.likes', 'like', 'like.userId = :userId', {
        userId,
      })
      .where('recipe.id = :recipeId', { recipeId })
      .getOne();

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const { ratings, likes, ...rest } = recipe;

    return {
      ...rest,
      userRating: ratings[0]?.value || 0,
      userLiked: likes.length > 0,
    };
  }

  async findAllWithUserData(userId: string) {
    const recipes = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect(
        'recipe.ratings',
        'rating',
        'rating.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('recipe.likes', 'like', 'like.userId = :userId', {
        userId,
      })
      .where('recipe.authorId = :userId', { userId })
      .orderBy('recipe.updatedAt', 'DESC')
      .getMany();

    return recipes.map(({ ratings, likes, ...rest }) => ({
      ...rest,
      userRating: ratings[0]?.value || 0,
      userLiked: likes.length > 0,
    }));
  }

  async findFiltered(filters: FilterRecipesDto): Promise<Recipe[]> {
    const {
      name,
      difficulty,
      maxTimeInMinutes,
      ingredientName,
      skip,
      take,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const query = this.recipeRepository.createQueryBuilder('recipe');

    if (name) {
      query.andWhere('recipe.name ILIKE :name', { name: `%${name}%` });
    }

    if (difficulty) {
      query.andWhere('recipe.difficulty = :difficulty', {
        difficulty: difficulty,
      });
    }

    if (maxTimeInMinutes) {
      query.andWhere('recipe.timeInMinutes <= :maxTimeInMinutes', {
        maxTimeInMinutes,
      });
    }

    if (ingredientName) {
      query.andWhere(
        `
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(recipe.ingredients) AS ing
        WHERE ing ->> 'name' ILIKE :ingredientName
      )
    `,
        { ingredientName: `%${ingredientName}%` },
      );
    }

    query.orderBy(`recipe.${sortBy}`, sortOrder);

    if (skip !== undefined) {
      query.skip(skip);
    }

    if (take !== undefined) {
      query.take(take);
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Recipe> {
    const existingRecipe = await this.recipeRepository.findOne({
      where: {
        id,
      },
    });

    if (!existingRecipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }

    return existingRecipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const existingRecipe = await this.findOne(id);

    Object.assign(existingRecipe, updateRecipeDto);

    return await this.recipeRepository.save(existingRecipe);
  }

  async remove(id: string): Promise<Recipe> {
    const existingRecipe = await this.findOne(id);

    return await this.recipeRepository.remove(existingRecipe);
  }
}
