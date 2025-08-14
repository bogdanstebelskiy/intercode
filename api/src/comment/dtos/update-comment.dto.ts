import { CreateCommentDto } from './create-comment.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateCommentDto extends PartialType(
  OmitType(CreateCommentDto, ['recipeId'] as const),
) {}
