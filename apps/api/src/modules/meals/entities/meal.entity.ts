import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { HouseholdRecipe } from '../../households/entities/household-recipe.entity.js';

@Entity('meals')
@Unique(['householdRecipeId', 'date'])
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  householdRecipeId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => HouseholdRecipe, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'householdRecipeId' })
  householdRecipe: Relation<HouseholdRecipe>;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
