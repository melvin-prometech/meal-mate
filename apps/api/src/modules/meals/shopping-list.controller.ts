import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindMealsSchema,
  type FindMealsDto,
  type ShoppingListItemDto,
} from '@meal-mate/schemas';
import { MealsService } from './meals.service.js';

@ApiTags('Shopping list')
@Controller('households/:householdId/shopping-list')
export class ShoppingListController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a shopping list from planned meals' })
  @ApiOkResponse({ description: 'Shopping list retrieved.' })
  @ApiBadRequestResponse({ description: 'Date range is invalid.' })
  @ApiNotFoundResponse({ description: 'Household not found.' })
  get(
    @Param('householdId') householdId: string,
    @Query({ schema: FindMealsSchema }) query: FindMealsDto,
  ): Promise<ShoppingListItemDto[]> {
    return this.mealsService.getShoppingList(householdId, query);
  }
}
