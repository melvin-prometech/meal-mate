import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('favorite_recipes')
export class FavoriteRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  recipeId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}