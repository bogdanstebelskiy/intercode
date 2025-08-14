import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Difficulty } from '../enums/difficulty.enum';
import { Ingredient } from '../types/ingredient.interface';
import { User } from '../../user/entities/user.entity';
import { Like } from '../../like/entities/like.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'jsonb', nullable: false })
  ingredients: Ingredient[];

  @Column({ nullable: false })
  timeInMinutes: number;

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.EASY,
  })
  difficulty: Difficulty;

  @Column({ nullable: false })
  photo: string;

  @Column('uuid')
  authorId: string;

  @ManyToOne(() => User, (user) => user.recipes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Like, (like) => like.recipe)
  likes: Like[];

  @OneToMany(() => Rating, (rating) => rating.recipe)
  ratings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
