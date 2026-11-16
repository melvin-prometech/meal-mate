import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { HouseholdsService } from './households.service.js';
import type { HouseholdResponseDto } from '@meal-mate/schemas';
import type { CreateHouseholdDto } from '@meal-mate/schemas';
import type { HouseholdMemberResponseDto } from '@meal-mate/schemas';
import type { RemoveHouseholdMemberDto } from '@meal-mate/schemas';
import type { UpdateHouseholdMemberRoleDto } from '@meal-mate/schemas';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../../types/authenticated-request.js';
import { HouseholdGuard } from '../auth/guards/household.guard.js';
import { HouseholdAdminGuard } from '../auth/guards/household-admin.guard.js';

@ApiTags('Households')
@Controller('/households')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
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

    @Get('mine')
    @ApiOperation({
        summary: 'Get households for a user',
        description: 'Retrieves the households that the specified user belongs to.',
    })
    @ApiOkResponse({
        description: 'Successfully retrieved the user\'s households. Returns an empty array if the user has no household memberships.',
    })
    async findMine(
        @Req() request: AuthenticatedRequest,
    ): Promise<HouseholdResponseDto[]> {
        return this.householdsService.findHouseholdsByUserId(request.user.id);
    }

    @Get(':householdId')
    @UseGuards(HouseholdGuard)
    @ApiOperation({
        summary: 'Get household by ID',
        description: 'Retrieves a single household by its ID including its members and their user details.',
    })
    @ApiOkResponse({
        description: 'Successfully retrieved household.',
    })
    @ApiNotFoundResponse({
        description: 'Household not found.',
    })
    async findOne(
        @Param('householdId') householdId: string,
    ): Promise<HouseholdResponseDto> {
        return await this.householdsService.findHouseholdById(householdId);
    }

    @Post()
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
        @Body() dto: CreateHouseholdDto,
        @Req() request: AuthenticatedRequest,
    ) {
        return await this.householdsService.createHousehold(request.user.id, dto);
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
        @Req() request: AuthenticatedRequest,
    ): Promise<HouseholdMemberResponseDto> {
        return await this.householdsService.addMember(householdId, request.user.id);
    }


    @Delete(':householdId/members')
    @UseGuards(HouseholdAdminGuard)
    @ApiOperation({
        summary: 'Remove a member from a household',
        description: 'Removes a user from the specified household.',
    })
    @ApiNoContentResponse({
        description: 'Member successfully removed.',
    })
    @ApiNotFoundResponse({
        description: 'Household, user, or membership not found.',
    })
    async removeMember(
        @Param('householdId') householdId: string, 
        @Body() dto: RemoveHouseholdMemberDto, 
    ): Promise<void> {
        await this.householdsService.removeMember(householdId, dto);
    }

    @Patch(':householdId/members/role')
    @UseGuards(HouseholdAdminGuard)
    @ApiOperation({ summary: 'Change a household member role' })
    @ApiOkResponse({ description: 'Member role successfully updated.' })
    @ApiBadRequestResponse({ description: 'Invalid role update request.' })
    @ApiNotFoundResponse({ description: 'Household, user, or membership not found.' })
    async updateMemberRole(
        @Param('householdId') householdId: string,
        @Body() dto: UpdateHouseholdMemberRoleDto,
    ): Promise<HouseholdMemberResponseDto> {
        return this.householdsService.updateMemberRole(householdId, dto);
    }
}
