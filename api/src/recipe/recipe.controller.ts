import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FilterRecipesDto } from './dto/filter-recipes.dto';
import type { AuthenticatedRequest } from '../auth/types/auth.interfaces';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  /*@Get()
  findAll() {
    return this.recipeService.findAll();
  }*/

  @Get()
  findFiltered(@Query() filters: FilterRecipesDto) {
    return this.recipeService.findFiltered(filters);
  }
  /*
  @Get(':id/with-user-data')
  @UseGuards(AuthGuard)
  async findWithUserData(
    @Param('id') recipeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.recipeService.findWithUserData(recipeId, userId);
  }
 */

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) recipeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.userId;

    if (userId) {
      return this.recipeService.findWithUserData(recipeId, userId);
    }

    return this.recipeService.findOne(recipeId);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.recipeService.remove(id);
  }
}
