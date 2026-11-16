import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
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
  CreateHouseholdRecipeSchema,
  type CreateHouseholdRecipeDto,
  type HouseholdRecipeResponseDto,
  type HouseholdRecipeWithRecipeResponseDto,
} from '@meal-mate/schemas';
import { HouseholdRecipesService } from './household-recipes.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { HouseholdGuard } from '../auth/guards/household.guard.js';
import { HouseholdAdminGuard } from '../auth/guards/household-admin.guard.js';
import type { AuthenticatedRequest } from '../../types/authenticated-request.js';

@ApiTags('Household recipes')
@Controller('household-recipes/:householdId')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class HouseholdRecipesController {
  constructor(private readonly householdRecipesService: HouseholdRecipesService) {}

  @Post()
  @UseGuards(HouseholdGuard)
  @ApiOperation({ summary: 'Save a recipe to a household' })
  @ApiCreatedResponse({ description: 'Recipe saved to household.', type: Object })
  @ApiBadRequestResponse({ description: 'Request body is invalid.' })
  @ApiConflictResponse({ description: 'Recipe is already saved in this household.' })
  @ApiNotFoundResponse({ description: 'Household, recipe, or household member not found.' })
  add(
    @Param('householdId') householdId: string,
    @Body({ schema: CreateHouseholdRecipeSchema }) dto: CreateHouseholdRecipeDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<HouseholdRecipeResponseDto> {
    return this.householdRecipesService.add(householdId, dto.recipeId, request.user.id);
  }

  @Get()
  @UseGuards(HouseholdGuard)
  @ApiOperation({ summary: 'Get recipes saved in a household' })
  @ApiOkResponse({ description: 'Household recipes retrieved.' })
  @ApiNotFoundResponse({ description: 'Household not found.' })
  findByHousehold(
    @Param('householdId') householdId: string
  ): Promise<HouseholdRecipeWithRecipeResponseDto[]> {
    return this.householdRecipesService.findByHousehold(householdId);
  }

  @Delete(':recipeId')
  @UseGuards(HouseholdAdminGuard)
  @ApiOperation({ summary: 'Remove a recipe from a household' })
  @ApiNoContentResponse({ description: 'Recipe removed from household.' })
  @ApiNotFoundResponse({ description: 'Household or saved recipe not found.' })
  remove(
    @Param('householdId') householdId: string,
    @Param('recipeId') recipeId: string,
  ): Promise<void> {
    return this.householdRecipesService.remove(householdId, recipeId);
  }
}
