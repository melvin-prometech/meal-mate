import { describe, expect, it } from 'vitest';
import { HouseholdRole } from '@meal-mate/schemas';
import { Household } from '../entities/household.entity.js';
import { mapHouseholdToResponseDto } from './households-mapper.js';

describe('mapHouseholdToResponseDto', () => {
  it('maps a household and its members to a response DTO', () => {
    const createdAt = new Date('2026-01-01T12:00:00.000Z');
    const updatedAt = new Date('2026-01-10T12:00:00.000Z');
    const joinedAt = new Date('2026-01-15T12:00:00.000Z');
    const household = {
      id: 'household-id',
      name: 'Home',
      joinCode: 'ABC123',
      creatorUserId: 'creator-id',
      createdAt,
      updatedAt,
      members: [
        {
          id: 'member-id',
          userId: 'user-id',
          role: HouseholdRole.MEMBER,
          joinedAt,
          user: { firstName: 'Ada', lastName: 'Lovelace' },
        },
      ],
    } as Household;

    expect(mapHouseholdToResponseDto(household)).toStrictEqual({
      id: 'household-id',
      name: 'Home',
      joinCode: 'ABC123',
      creatorUserId: 'creator-id',
      createdAt,
      updatedAt,
      members: [
        {
          id: 'member-id',
          userId: 'user-id',
          firstName: 'Ada',
          lastName: 'Lovelace',
          role: HouseholdRole.MEMBER,
          joinedAt,
        },
      ],
    });
  });
});