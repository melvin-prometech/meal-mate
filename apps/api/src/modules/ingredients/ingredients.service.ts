import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity.js';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

async findOrCreate(
    name: string,
    repository: Repository<Ingredient>,
  ): Promise<Ingredient> {
    const normalizedName = name.trim().toLowerCase();

    const existing = await repository
      .createQueryBuilder('ingredient')
      .where('LOWER(ingredient.name) = :name', {
        name: normalizedName,
      })
      .getOne();

    if (existing) {
      return existing;
    }

    const ingredient = repository.create({
      name: normalizedName,
    });

    return repository.save(ingredient);
  }
}