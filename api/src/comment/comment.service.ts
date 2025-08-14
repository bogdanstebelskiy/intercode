import { Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { Recipe } from '../recipe/entities/recipe.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<any> {
    const recipeId = createCommentDto.recipeId;
    const existingRecipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });

    if (!existingRecipe) {
      throw new NotFoundException(`Recipe with id ${recipeId} not found`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
    });

    const savedComment = await this.commentRepository.save(comment);

    const { userId: _userId, ...rest } = savedComment;

    return {
      ...rest,
      user: {
        id: existingUser.id,
        userName: existingUser.userName,
        avatar: existingUser.avatar,
      },
    };
  }

  async findByRecipe(recipeId: string): Promise<Comment[]> {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'comment.id',
        'comment.content',
        'comment.recipeId',
        'comment.userId',
        'comment.createdAt',
        'comment.updatedAt',
        'user.id',
        'user.userName',
        'user.avatar',
      ])
      .where('comment.recipeId = :recipeId', { recipeId })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }

  async getCommentsCount(recipeId: string): Promise<number> {
    return await this.commentRepository.count({
      where: { recipeId },
    });
  }
}
