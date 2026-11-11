import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse
} from '@nestjs/swagger';

import { HouseholdsService } from './households.service.js';
import type { HouseholdResponseDto } from '@meal-mate/schemas';
import type { CreateHouseholdDto } from '@meal-mate/schemas';
import type { AddHouseholdMemberDto } from '@meal-mate/schemas';
import type { HouseholdMemberResponseDto } from '@meal-mate/schemas';

@ApiTags('Households')
@Controller('/households')
export class HouseholdsController {
    constructor(private readonly householdsService: HouseholdsService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all households',
        description:
        'Retrieves all households including their members with their names and roles.',
    })
    @ApiOkResponse({
        description: 'Successfully retrieved all households.',
    })
    async findAll(): Promise<HouseholdResponseDto[]> {
        return await this.householdsService.findAll();
    }

    @Post('/:userId')
    @ApiOperation({
        summary: 'Create a new household',
        description:
        'Creates a new household with the specified name and automatically registers the user as the ADMIN member.',
    })
    @ApiCreatedResponse({
        description: 'The household has been successfully created.',
    })
    @ApiBadRequestResponse({
        description: 'The request payload is invalid.',
    })
    @ApiNotFoundResponse({
        description: 'User not found.',
    })
    async create(
        @Param('userId') userId: string,
        @Body() dto: CreateHouseholdDto,
    ) {
        return await this.householdsService.createHousehold(userId, dto);
    }

    @Post(':householdId/join')
    @ApiOperation({
        summary: 'Join a household',
        description: 'Adds a user as a regular MEMBER to an existing household.',
    })
    @ApiCreatedResponse({
        description: 'The user has successfully joined the household.',
    })
    @ApiNotFoundResponse({
        description: 'Household or User not found.',
    })
    @ApiConflictResponse({
        description: 'User is already a member of this household.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid request body.',
    })
    async addMember(
    @Param('householdId') householdId: string,
    @Body() dto: AddHouseholdMemberDto,
    ): Promise<HouseholdMemberResponseDto> {
        return await this.householdsService.addMember(householdId, dto);
    }
}