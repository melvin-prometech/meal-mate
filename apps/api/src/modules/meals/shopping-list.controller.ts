import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { HouseholdGuard } from '../auth/guards/household.guard.js';

@ApiTags('Shopping list')
@Controller('households/:householdId/shopping-list')
@UseGuards(JwtAuthGuard, HouseholdGuard)
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
