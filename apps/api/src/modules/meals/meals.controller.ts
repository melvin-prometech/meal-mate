import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateMealSchema,
  FindMealsSchema,
  UpdateMealSchema,
  type CreateMealDto,
  type FindMealsDto,
  type MealResponseDto,
  type UpdateMealDto,
} from '@meal-mate/schemas';
import { MealsService } from './meals.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { HouseholdGuard } from '../auth/guards/household.guard.js';
import { HouseholdAdminGuard } from '../auth/guards/household-admin.guard.js';

@ApiTags('Meals')
@Controller('households/:householdId/meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @UseGuards(HouseholdGuard)
  @ApiOperation({ summary: 'Get planned meals for a household' })
  @ApiOkResponse({ description: 'Planned meals retrieved.' })
  @ApiBadRequestResponse({ description: 'Date range is invalid.' })
  @ApiNotFoundResponse({ description: 'Household not found.' })
  findByHousehold(
    @Param('householdId') householdId: string,
    @Query({ schema: FindMealsSchema }) query: FindMealsDto,
  ): Promise<MealResponseDto[]> {
    return this.mealsService.findByHousehold(householdId, query);
  }

  @Post()
  @UseGuards(HouseholdAdminGuard)
  @ApiOperation({ summary: 'Plan a meal for a household' })
  @ApiCreatedResponse({ description: 'Meal planned.' })
  @ApiBadRequestResponse({ description: 'Request body is invalid.' })
  @ApiConflictResponse({ description: 'Recipe is already planned for that date.' })
  @ApiNotFoundResponse({ description: 'Household or household recipe not found.' })
  create(
    @Param('householdId') householdId: string,
    @Body({ schema: CreateMealSchema }) dto: CreateMealDto,
  ): Promise<MealResponseDto> {
    return this.mealsService.create(householdId, dto);
  }

  @Patch(':mealId')
  @UseGuards(HouseholdAdminGuard)
  @ApiOperation({ summary: 'Update a planned meal' })
  @ApiOkResponse({ description: 'Planned meal updated.' })
  @ApiBadRequestResponse({ description: 'Request body is invalid.' })
  @ApiConflictResponse({ description: 'Recipe is already planned for that date.' })
  @ApiNotFoundResponse({ description: 'Household or meal not found.' })
  update(
    @Param('householdId') householdId: string,
    @Param('mealId') mealId: string,
    @Body({ schema: UpdateMealSchema }) dto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    return this.mealsService.update(householdId, mealId, dto);
  }

  @Delete(':mealId')
  @UseGuards(HouseholdAdminGuard)
  @ApiOperation({ summary: 'Remove a planned meal' })
  @ApiNoContentResponse({ description: 'Planned meal removed.' })
  @ApiNotFoundResponse({ description: 'Household or meal not found.' })
  remove(
    @Param('householdId') householdId: string,
    @Param('mealId') mealId: string,
  ): Promise<void> {
    return this.mealsService.remove(householdId, mealId);
  }
}
