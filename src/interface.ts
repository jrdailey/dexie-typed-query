import { AtLeastTwo, ExactlyOne, ExactlyOneKey, ExactlyTwo, SingleRecord, StringKeyOf } from './utilityTypes'
import { Collection, IDType, InsertType, WhereClause } from 'dexie'

export type ScalarOp = 'equals' | 'notEqual'
export type NumberOrDateOp = 'below' | 'belowOrEqual' | 'above' | 'aboveOrEqual'
export type PairOp = 'between'
export type ArrayOp = 'in' | 'notIn'
export type StringOp = 'equalsIgnoreCase' | 'startsWith' | 'startsWithIgnoreCase'

export type OpHandler<T, K extends keyof T> = {
  handleWhere: (clause: WhereClause<T, IDType<T, K>, InsertType<T, K>>) => Collection<T, IDType<T, K>, InsertType<T, K>>,
  handleFilter: (objectValue: T[StringKeyOf<T>]) => boolean,
}

export type FlatFieldCondition<T, F extends StringKeyOf<T> = StringKeyOf<T>> =
  | { field: F, op: ScalarOp, value: T[F] }
  | { field: F, op: StringOp, value: string }
  | { field: F, op: NumberOrDateOp, value: number | Date }
  | { field: F, op: ArrayOp, value: AtLeastTwo<T[F]> }
  | { field: F, op: PairOp, value: ExactlyTwo<T[F]> }

export type AnyOpValueMap<T> =
  | SingleRecord<ScalarOp, ExactlyOne<T>>
  | SingleRecord<ArrayOp, AtLeastTwo<T>>
  | SingleRecord<PairOp, ExactlyTwo<T>>

export type OpValueMap<T> =
  T extends string ? SingleRecord<StringOp, string> | AnyOpValueMap<T> :
    T extends number | Date ? SingleRecord<NumberOrDateOp, number | Date> | AnyOpValueMap<T> :
      AnyOpValueMap<T>

export type NestedFieldCondition<T> = ExactlyOneKey<{
  [K in keyof T]: OpValueMap<T[K]>
}>

export type OrClause<T> = AtLeastTwo<NestedFieldCondition<T>>
export type AndClause<T> = AtLeastTwo<NestedFieldCondition<T>>

export type LogicalQuery<T> = NestedFieldCondition<T> | { or: OrClause<T> } | { and: AndClause<T> }

export type OrderByDirection = 'asc' | 'desc'

export interface QueryOptions<T> {
  orderBy?: SingleRecord<keyof T, OrderByDirection>,
  limit?: number,
  offset?: number,
}


export interface TypedQueryInterface<T> {
  /**
  * Returns a promise containing all entities in the table.
  *
  * @param options optional object containing options to apply to the query
  * @returns a promise containing all entities that meet the requirements for the given options
  */
  all: (options?: QueryOptions<T>) => Promise<T[]>,

  /**
   * Queries the table using the given condition.
   *
   * @param condition the query condition
   * @param options optional object containing options to apply to the query
   * @returns a promise continaing all entities that meet the given condition and options
   */
  where: (condition: LogicalQuery<T>, options?: QueryOptions<T>) => Promise<T[]>,
}
