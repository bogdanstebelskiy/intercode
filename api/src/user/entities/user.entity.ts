import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('text', { array: true, nullable: true, default: '{}' })
  dietaryPreferences: string[];

  @Column('text', { array: true, nullable: true, default: '{}' })
  allergies: string[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
