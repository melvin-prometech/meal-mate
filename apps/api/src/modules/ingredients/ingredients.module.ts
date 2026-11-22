import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsController } from './ingredients.controller.js';
import { IngredientsService } from './ingredients.service.js';
import { Ingredient } from './entities/ingredient.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [TypeOrmModule, IngredientsService]
})
export class IngredientsModule {}