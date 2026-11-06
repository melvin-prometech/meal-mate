import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsController } from './ingredients.controller.js';
import { IngredientsService } from './ingredients.module.js';
import { Ingredient } from './entities/ingredient.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [TypeOrmModule]
})
export class IngredientsModule {}
