import { FlatFieldCondition, OpHandler } from './interface'
import { IndexableTypePart } from 'dexie'

// TODO: Handle anyOf and anyOfIgnoreCase
export const getClauseHandler = <T, K extends keyof T>(condition: FlatFieldCondition<T>): OpHandler<T, K> => {
  switch (condition.op) {
    case 'equals': return {
      handleWhere: (clause) => clause.equals(condition.value as IndexableTypePart),
      handleFilter: (objectValue) => {
        if (condition.value instanceof Date) {
          return (objectValue as Date).getDate() === (condition.value as Date).getDate()
        }

        return objectValue === condition.value
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
          return (objectValue as Date).getDate() !== (condition.value as Date).getDate()
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

        return clause.between(lower, upper)
      },
      handleFilter: (objectValue) => {
        const [lower, upper] = condition.value

        return lower < objectValue && objectValue < upper
      },
    }
    case 'in': return {
      handleWhere: (clause) => clause.anyOf(condition.value as IndexableTypePart[]),
      handleFilter: (objectValue) => {
        if (objectValue instanceof Date) {
          return condition.value.map(d => (d as Date).getTime())
            .includes(objectValue.getTime())
        } else {
          return condition.value.includes(objectValue)
        }
      },
    }
    case 'notIn': return {
      handleWhere: (clause) => clause.noneOf(condition.value as IndexableTypePart[]),
      handleFilter: (objectValue) => {
        if (objectValue instanceof Date) {
          return condition.value.map(d => (d as Date).getTime())
            .includes(objectValue.getTime()) === false
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
