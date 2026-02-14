import { DexieWhereClause, FlatFieldCondition } from '../src'
import { getClauseHandler } from '../src/clauseHandlers'

describe('getClauseHandlers', () => {
  type TestType = { testString: string, testNumber: number, testBoolean: boolean, testDate: Date }

  describe('anyOf', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      op: 'anyOf',
      value: ['test1', 'test2', 'test3'],
    }
    const { handleWhere, handleFilter } = getClauseHandler(condition)

    describe('handleWhere', () => {
      it('calls `anyOf` on clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          anyOf: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.anyOf).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    describe('handleFilter', () => {
      it('returns true when the object value is in the condition range', () => {
        expect(handleFilter('test1')).toBe(true)
        expect(handleFilter('test2')).toBe(true)
        expect(handleFilter('test3')).toBe(true)
      })

      it('returns false when the object value is NOT in the condition range', () => {
        expect(handleFilter('test0')).toBe(false)
      })
    })
  })

  describe('anyOfIgnoreCase', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      op: 'anyOfIgnoreCase',
      value: ['test1', 'TeSt2', 'TEST3'],
    }

    const { handleWhere, handleFilter } = getClauseHandler(condition)

    describe('handleWhere', () => {
      it('calls anyOfIgnoreCase on the clase and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          anyOfIgnoreCase: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.anyOfIgnoreCase).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    describe('handleFilter', () => {
      it('returns true when the object value is in the condition range, ignoring case', () => {
        expect(handleFilter('test1')).toBe(true)
        expect(handleFilter('test2')).toBe(true)
        expect(handleFilter('TeSt2')).toBe(true)
        expect(handleFilter('test3')).toBe(true)
        expect(handleFilter('TEST3')).toBe(true)
      })

      it('returns false when the object value is NOT in the condition range', () => {
        expect(handleFilter('test0')).toBe(false)
      })
    })
  })
})
