import 'fake-indexeddb/auto'

import Dexie from 'dexie'
import type { EntityTable } from 'dexie'
import type { User } from './user'

export type TestDB = Dexie & {
  users: EntityTable<User, 'id'>,
}

export const buildDb = (name: string = `TestDB-${Date.now()}`): TestDB => {
  const db = new Dexie(name) as TestDB

  db.version(1).stores({
    users: '&id, createdAt, updatedAt, [name+dob], email, subscriptionStatus, loginAttempts, junkDrawer',
  })

  return db
}

export const resetDb = async (db: TestDB) => {
  await db.delete()
  await db.open()
}

