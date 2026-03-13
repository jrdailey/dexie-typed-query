import type { FlatFieldCondition, OpHandler } from './interface'
import type { IndexableTypePart } from 'dexie'

const containsArray = <T>(arrayList: T[][], arrayToCheck: T[]) => {
  return arrayList.map(v => JSON.stringify(v)).includes(JSON.stringify(arrayToCheck))
}

export const getClauseHandlers = <T, K extends keyof T>(condition: FlatFieldCondition<T>): OpHandler<T, K> => {
  switch (condition.op) {
    case 'anyOfIgnoreCase': return {
      handleWhere: (clause) => clause.anyOfIgnoreCase(condition.value),
      handleFilter: (objectValue) => {
        const downcasedConditionArray = condition.value.map(e => e.toLowerCase())
        const downcasedObjectValue = (objectValue as string).toLowerCase()

        return downcasedConditionArray.includes(downcasedObjectValue)
      },
    }
    case 'equals': return {
      handleWhere: (clause) => clause.equals(condition.value as IndexableTypePart),
      handleFilter: (objectValue) => {
        if (condition.value instanceof Date) {
          return (objectValue as Date).getTime() === (condition.value as Date).getTime()
        } else if (objectValue instanceof Array && condition.value instanceof Array) {
          return JSON.stringify(condition.value) === JSON.stringify(objectValue)
        } else {
          return objectValue === condition.value
        }
      },
    }
    case 'equalsIgnoreCase': return {
      handleWhere: (clause) => clause.equalsIgnoreCase(condition.value),
      handleFilter: (objectValue) => {
        return (objectValue as string).toLowerCase() === condition.value.toLowerCase()
      },
    }
    case 'notEqual': return {
      handleWhere: (clause) => clause.notEqual(condition.value as IndexableTypePart[]),
      handleFilter: (objectValue) => {
        if (condition.value instanceof Date) {
          return (objectValue as Date).getTime() !== (condition.value as Date).getTime()
        }

        return objectValue !== condition.value
      },
    }
    case 'below': return {
      handleWhere: (clause) => clause.below(condition.value),
      handleFilter: (objectValue) => objectValue < condition.value,
    }
    case 'belowOrEqual': return {
      handleWhere: (clause) => clause.belowOrEqual(condition.value),
      handleFilter: (objectValue) => objectValue <= condition.value,
    }
    case 'above': return {
      handleWhere: (clause) => clause.above(condition.value),
      handleFilter: (objectValue) => objectValue > condition.value,
    }
    case 'aboveOrEqual': return {
      handleWhere: (clause) => clause.aboveOrEqual(condition.value),
      handleFilter: (objectValue) => objectValue >= condition.value,
    }
    case 'between': return {
      handleWhere: (clause) => {
        const [lower, upper] = condition.value

        return clause.between(lower, upper, false, false)
      },
      handleFilter: (objectValue) => {
        const [lower, upper] = condition.value

        return lower < objectValue && objectValue < upper
      },
    }
    case 'betweenIncludeLower': return {
      handleWhere: (clause) => {
        const [lower, upper] = condition.value

        return clause.between(lower, upper, true, false)
      },
      handleFilter: (objectValue) => {
        const [lower, upper] = condition.value

        return lower <= objectValue && objectValue < upper
      },
    }
    case 'betweenIncludeUpper': return {
      handleWhere: (clause) => {
        const [lower, upper] = condition.value

        return clause.between(lower, upper, false, true)
      },
      handleFilter: (objectValue) => {
        const [lower, upper] = condition.value

        return lower < objectValue && objectValue <= upper
      },
    }
    case 'betweenIncludeLowerAndUpper': return {
      handleWhere: (clause) => {
        const [lower, upper] = condition.value

        return clause.between(lower, upper, true, true)
      },
      handleFilter: (objectValue) => {
        const [lower, upper] = condition.value

        return lower <= objectValue && objectValue <= upper
      },
    }
    case 'anyOf': return {
      handleWhere: (clause) => clause.anyOf(condition.value as IndexableTypePart[]),
      handleFilter: (objectValue) => {
        if (objectValue instanceof Date) {
          return condition.value.map(d => (d as Date).getTime())
            .includes(objectValue.getTime())
        } else if (objectValue instanceof Array && condition.value instanceof Array) {
          return containsArray(condition.value as T[][], objectValue)
        } else {
          return condition.value.includes(objectValue)
        }
      },
    }
    case 'noneOf': return {
      handleWhere: (clause) => clause.noneOf(condition.value as IndexableTypePart[]),
      handleFilter: (objectValue) => {
        if (objectValue instanceof Date) {
          return condition.value.map(d => (d as Date).getTime())
            .includes(objectValue.getTime()) === false
        } else if (objectValue instanceof Array && condition.value instanceof Array) {
          return containsArray(condition.value as T[][], objectValue) === false
        } else {
          return condition.value.includes(objectValue) === false
        }
      },
    }
    case 'startsWith': return {
      handleWhere: (clause) => clause.startsWith(condition.value),
      handleFilter: (objectValue) => (objectValue as string).startsWith(condition.value),
    }
    case 'startsWithIgnoreCase': return {
      handleWhere: (clause) => clause.startsWithIgnoreCase(condition.value),
      handleFilter: (objectValue) => (objectValue as string).toLowerCase().startsWith(condition.value.toLowerCase()),
    }
    default: throw new Error('Unsupported QueryOp')
  }
}
