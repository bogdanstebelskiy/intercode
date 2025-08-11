import { AuthGuard } from '../auth/guards/auth.guard';
import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import type { AuthenticatedRequest } from '../auth/types/auth.interfaces';

@Controller('recipes/:recipeId/rating')
@UseGuards(AuthGuard)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  rateRecipe(
    @Param('recipeId') recipeId: string,
    @Body() dto: CreateRatingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ratingService.rateRecipe(req.user.userId, recipeId, dto);
  }
}
