import type { AtLeastTwo, ExactlyOne, ExactlyOneKey, ExactlyTwo, SingleRecord, StringKeyOf } from './utilityTypes'
import type { Collection, IDType, InsertType, WhereClause } from 'dexie'

export type EqualityOp = 'equals' | 'notEqual'
export type NumberOrDateOp = 'below' | 'belowOrEqual' | 'above' | 'aboveOrEqual'
export type RangeOp = 'between' | 'betweenIncludeLower' | 'betweenIncludeUpper' | 'betweenIncludeLowerAndUpper'
export type InclusionOp = 'in' | 'notIn'
export type StringOp = 'equalsIgnoreCase' | 'startsWith' | 'startsWithIgnoreCase'
export type StringInclusionOp = 'anyOfIgnoreCase'

export type DexieWhereClause<T, K extends keyof T = keyof T> = WhereClause<T, IDType<T, K>, InsertType<T, K>>

export type OpHandler<T, K extends keyof T> = {
  handleWhere: (clause: DexieWhereClause<T, K>) => Collection<T, IDType<T, K>, InsertType<T, K>>,
  handleFilter: (objectValue: T[StringKeyOf<T>]) => boolean,
}

export type FlatFieldCondition<T, F extends StringKeyOf<T> = StringKeyOf<T>> =
  // | { field: F, op: EqualityOp, value: string | number | Date | (string | number | Date | (string | number | Date)[])[] }
  | { field: F, op: EqualityOp, value: T[F] }
  | { field: F, op: StringOp, value: string }
  | { field: F, op: StringInclusionOp, value: string[] }
  | { field: F, op: NumberOrDateOp, value: number | Date }
  | { field: F, op: InclusionOp, value: AtLeastTwo<T[F]> }
  | { field: F, op: RangeOp, value: ExactlyTwo<number | Date> }

export type AnyOpValueMap<T> = SingleRecord<InclusionOp, AtLeastTwo<T>>

export type OpValueMap<T> =
  T extends string ? SingleRecord<StringOp, string> | SingleRecord<EqualityOp, ExactlyOne<T>> | AnyOpValueMap<T> :
    T extends string[] ? SingleRecord<StringInclusionOp, T> | SingleRecord<EqualityOp, ExactlyOne<T>> |  AnyOpValueMap<T>:
      T extends number | Date ? SingleRecord<NumberOrDateOp, T> | SingleRecord<RangeOp, ExactlyTwo<T>> | SingleRecord<EqualityOp, ExactlyOne<T>> | AnyOpValueMap<T> :
        T extends (string | number | Date | (string | number | Date)[])[] ? SingleRecord<EqualityOp, T> | AnyOpValueMap<T> :
          never

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
