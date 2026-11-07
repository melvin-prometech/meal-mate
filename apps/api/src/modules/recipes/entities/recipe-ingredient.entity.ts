import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { Recipe } from './recipe.entity.js';
import { Ingredient } from '../../ingredients/entities/ingredient.entity.js';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  recipeId: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients)
  @JoinColumn({ name: 'recipeId' })
  recipe: Relation<Recipe>;

  @Column({ type: 'uuid' })
  ingredientId: string;

  @ManyToOne(
    () => Ingredient,
    (ingredient) => ingredient.recipeIngredients,
  )
  @JoinColumn({ 
    name: 'ingredientId',
    referencedColumnName: 'id',
  })
  ingredient: Relation<Ingredient>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantity: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  unit: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  notes: string | null;
}