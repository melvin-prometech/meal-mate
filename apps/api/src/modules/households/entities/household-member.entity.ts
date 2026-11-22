import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { HouseholdRole } from '@meal-mate/schemas';
import { Household } from './household.entity.js';

@Entity('household_members')
@Unique(['userId', 'householdId'])
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

  @ManyToOne(() => User, (user) => user.householdMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ManyToOne(() => Household, (household) => household.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'householdId' })
  household: Relation<Household>;
}