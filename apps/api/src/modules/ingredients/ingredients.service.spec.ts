import { describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity.js';
import { IngredientsService } from './ingredients.service.js';

describe('IngredientsService.findOrCreate', () => {
  it('normalizes the name for lookup and returns the existing ingredient', async () => {
    const existingIngredient = { id: 'ingredient-id', name: 'tomato' } as Ingredient;
    const getOne = vi.fn().mockResolvedValue(existingIngredient);
    const where = vi.fn().mockReturnThis();
    const createQueryBuilder = vi.fn().mockReturnValue({ where, getOne });
    const create = vi.fn();
    const save = vi.fn();
    const repository = {
      createQueryBuilder,
      create,
      save,
    } as unknown as Repository<Ingredient>;
    const service = new IngredientsService(repository);

    const result = await service.findOrCreate('  TOMATO  ', repository);

    expect(where).toHaveBeenCalledWith('LOWER(ingredient.name) = :name', {
      name: 'tomato',
    });
    expect(result).toBe(existingIngredient);
    expect(create).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });
});
