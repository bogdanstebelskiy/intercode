import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import type { AuthenticatedRequest } from '../auth/types/auth.interfaces';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Comment> {
    return await this.commentService.create(createCommentDto, req.user.userId);
  }

  @Get('recipe/:recipeId')
  async findByRecipe(
    @Param('recipeId', ParseUUIDPipe) recipeId: string,
  ): Promise<Comment[]> {
    return await this.commentService.findByRecipe(recipeId);
  }

  @Get('recipe/:recipeId/count')
  async getCommentsCount(
    @Param('recipeId', ParseUUIDPipe) recipeId: string,
  ): Promise<{ count: number }> {
    const count = await this.commentService.getCommentsCount(recipeId);
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Comment> {
    return await this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Comment> {
    return await this.commentService.update(
      id,
      updateCommentDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return await this.commentService.remove(id, req.user.userId);
  }
}
