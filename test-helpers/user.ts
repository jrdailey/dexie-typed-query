import { daysFromNow } from './utils'
import { v4 as uuid } from 'uuid'

export enum SubscriptionStatus {
  NotSubscribed,
  TierOne,
  TierTwo,
}

export interface User {
  id: string,
  createdAt: Date,
  updatedAt?: Date | null,
  name: string,
  email: string,
  dob: Date,
  subscriptionStatus: SubscriptionStatus,
  loginAttempts: number,
}

export const buildUser = (overrides: Partial<User> = {}): User => {
  const now = new Date()

  return {
    id: uuid(),
    createdAt: now,
    updatedAt: now,
    name: 'A. User',
    email: 'user@test.test',
    dob: daysFromNow(-1),
    subscriptionStatus: SubscriptionStatus.NotSubscribed,
    loginAttempts: 1,
    ...overrides,
  }
}
