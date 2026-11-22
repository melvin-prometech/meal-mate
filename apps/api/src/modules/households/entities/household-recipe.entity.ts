import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Household } from './household.entity.js';
import { Recipe } from '../../recipes/entities/recipe.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('household_recipes')
@Unique(['householdId', 'recipeId'])
export class HouseholdRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  householdId: string;

  @Column({ type: 'uuid' })
  recipeId: string;

  @Column({ type: 'uuid' })
  addedBy: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'householdId' })
  household: Relation<Household>;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Relation<Recipe>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addedBy' })
  addedByUser: Relation<User>;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
