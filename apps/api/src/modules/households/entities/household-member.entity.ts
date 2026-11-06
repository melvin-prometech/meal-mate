import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { HouseholdRole } from '@meal-mate/schemas';

@Entity('household_members')
export class HouseholdMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  householdId: string;

  @Column({
    type: 'enum',
    enum: HouseholdRole,
    default: HouseholdRole.MEMBER,
  })
  role: HouseholdRole;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt: Date;
}