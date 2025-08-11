import { LikeService } from './like.service';
import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/auth.interfaces';

@Controller('recipes/:recipeId/like')
@UseGuards(AuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  likeRecipe(
    @Param('recipeId') recipeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likeService.likeRecipe(req.user.userId, recipeId);
  }

  @Delete()
  unlikeRecipe(
    @Param('recipeId') recipeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likeService.unlikeRecipe(req.user.userId, recipeId);
  }
}
