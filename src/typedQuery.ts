import type { Collection, EntityTable, IDType, InsertType } from 'dexie'
import type { FlatFieldCondition, LogicalQuery, NestedFieldCondition, OpValueMap, OrderByDirection, TypedQueryInterface } from './interface'
import { getClauseHandler } from './clauseHandlers'

const flattenNestedFieldCondition = <T>(
  nestedConditions: NestedFieldCondition<T>,
): FlatFieldCondition<T> => {
  return Object.entries(nestedConditions).map(entry => {
    const field = entry[0]
    const condition = entry[1] as OpValueMap<T>
    const [op, value] = Object.entries(condition)[0]

    return { field, op, value } as FlatFieldCondition<T>
  })[0]
}

const flattenNestedFieldConditionList = <T>(
  nestedConditions: NestedFieldCondition<T>[],
): FlatFieldCondition<T>[] => {
  return nestedConditions.flatMap(c => flattenNestedFieldCondition(c))
}

const applyCondition = <T, K extends keyof T>(
  query: EntityTable<T, K, InsertType<T, K>>,
  condition: LogicalQuery<T>,
): Collection<T, IDType<T, K>, InsertType<T, K>> => {
  // Handle ORs
  if ('or' in condition) {
    const [firstCondition, ...remaining] = flattenNestedFieldConditionList(condition.or)
    let opHandler = getClauseHandler<T, K>(firstCondition)
    let result = opHandler.handleWhere(query.where(firstCondition.field))

    for (const nextCondition of remaining) {
      opHandler = getClauseHandler<T, K>(nextCondition)

      result = opHandler.handleWhere(result.or(nextCondition.field))
    }

    return result
  }

  // Handle ANDs
  if ('and' in condition) {
    const [firstCondition, ...remaining] = flattenNestedFieldConditionList(condition.and)

    let opHandler = getClauseHandler<T, K>(firstCondition)

    // Use first condition for the initial query
    return opHandler.handleWhere(query.where(firstCondition.field)).and(object => {
      // Use remaining conditions to find objects that meet all conditions
      return remaining.every(nextCondition => {
        opHandler = getClauseHandler(nextCondition)

        return opHandler.handleFilter(object[nextCondition.field])
      })
    })
  }

  // Handle single condition
  const flatCondition = flattenNestedFieldCondition(condition)
  const opHandler = getClauseHandler<T, K>(flatCondition)

  return opHandler.handleWhere(query.where(flatCondition.field))
}

/**
 * Takes the given table and wraps it in a type-safe interface.
 *
 * @param table the table to query
 * @returns a TypedQueryInterface
 */
export const typedQuery = <T, K extends keyof T>(table: EntityTable<T, K>): TypedQueryInterface<T> => {
  return {
    all: (options) => {
      let query: EntityTable<T, K> | Collection<T, IDType<T, K>, InsertType<T, K>> = table

      if (options?.orderBy) {
        const field = Object.keys(options.orderBy)[0]
        const direction = Object.values(options.orderBy)[0]

        query = query.orderBy(field)

        if (direction === 'desc') query = query.reverse()
      }
      if (options?.offset) query = query.offset(options.offset)
      if (options?.limit) query = query.limit(options.limit)

      return query.toArray()
    },
    // TODO: support compound indexes. Maybe check automatically if a compound index exists when ANDing. https://dexie.org/docs/Compound-Index
    where: async (condition, options) => {
      let query = applyCondition(table, condition)

      if (options?.orderBy) {
        const field = Object.keys(options.orderBy)[0]
        const direction = Object.values(options.orderBy)[0] as OrderByDirection

        if (direction === 'desc') query = query.reverse()

        let result = await query.sortBy(field)

        if (options?.offset) result = result.slice(options.offset)
        if (options?.limit) result = result.slice(0, options.limit)

        return new Promise((resolve) => resolve(result))
      } else {
        if (options?.offset) query = query.offset(options.offset)
        if (options?.limit) query = query.limit(options.limit)

        return query.toArray()
      }
    },
  }
}
