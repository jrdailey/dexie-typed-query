import type { AnyOpValueMap, OpValueMap } from '../src'
import type { AtLeastTwo, ExactlyTwo } from '../src/utilityTypes'
import { expectTypeOf } from 'vitest'

// interface TestType {
//   stringField: string,
//   numberField: number,
//   dateField: Date,
//   booleanField: boolean,
//   nullField: null,
//   stringArrayField: string[],
//   numberArrayField: number[],
//   dateArrayField: Date[],
//   nestedStringArrayField: string[][],
//   nestedNumberArrayField: number[][],
//   nestedDateArrayField: Date[][],
// }

// const testObject: TestType = {
//   stringField: 'string',
//   numberField: 10,
//   dateField: new Date(),
//   booleanField: true,
//   nullField: null,
//   stringArrayField: ['string1', 'string2'],
//   numberArrayField: [1, 2, 3],
//   dateArrayField: [new Date('01/01/2001'), new Date('11/11/2011')],
//   nestedStringArrayField: [['string1', 'string2'], ['string3', 'string4']],
//   nestedNumberArrayField: [[1, 2], [3, 4]],
//   nestedDateArrayField: [[new Date(), new Date('01/01/2001')], [new Date('11/11/2011')]],
// }

describe.skip('FlatFieldCondition', () => {
  // TODO add tests
})

describe('AnyOpValue', () => {
  it('supports inclusion ops', () => {
    expectTypeOf({ anyOf: ['test1', 'test2'] as AtLeastTwo<string> }).toExtend<AnyOpValueMap<string>>()
    expectTypeOf({ noneOf: ['test1', 'test2'] as AtLeastTwo<string> }).toExtend<AnyOpValueMap<string>>()
  })
})

describe('OpValueMap', () => {
  describe('with a string', () => {
    type TestType = OpValueMap<string>

    it('accepts string ops', () => {
      expectTypeOf({ equalsIgnoreCase: 'test' }).toExtend<TestType>()
      expectTypeOf({ startsWith: 'test' }).toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: 'test' }).toExtend<TestType>()
    })

    it('accepts equality ops', () => {
      expectTypeOf({ equals: 'test' }).toExtend<TestType>()
      expectTypeOf({ notEqual: 'test' }).toExtend<TestType>()
    })

    it('accepts inclusion ops', () => {
      expectTypeOf({ anyOf: ['test1', 'test2'] as AtLeastTwo<string> }).toExtend<TestType>()
      expectTypeOf({ noneOf: ['test1', 'test2'] as AtLeastTwo<string> }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ below: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ above: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ between: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: 'test' }).not.toExtend<TestType>()
    })

    it('rejects numbers', () => {
      expectTypeOf({ equalsIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: 1 }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ equals: 1 }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [1, 2] as AtLeastTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [1, 2] as AtLeastTwo<number> }).not.toExtend<TestType>()
    })

    it('rejects dates', () => {
      expectTypeOf({ equalsIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ equals: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [new Date(), new Date()] as AtLeastTwo<Date> }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [new Date(), new Date()] as AtLeastTwo<Date> }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ equalsIgnoreCase: true }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: true }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: true }).not.toExtend<TestType>()
      expectTypeOf({ equals: true }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: true }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [true, false] as AtLeastTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [true, false] as AtLeastTwo<boolean> }).not.toExtend<TestType>()
    })
  })

  describe('with a string array', () => {
    type TestType = OpValueMap<string[]>

    it('accepts string inclusion ops', () => {
      expectTypeOf({ anyOfIgnoreCase: ['test1', 'test2'] }).toExtend<TestType>()
      expectTypeOf({ anyOf: [['test1', 'test2'], ['test3']] as AtLeastTwo<string[]> }).toExtend<TestType>()
      expectTypeOf({ noneOf: [['test1', 'test2'], ['test3']] as AtLeastTwo<string[]> }).toExtend<TestType>()
    })

    it('accepts equality ops', () => {
      expectTypeOf({ equals: ['test'] }).toExtend<TestType>()
      expectTypeOf({ notEqual: ['test'] }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ equalsIgnoreCase: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: ['test1', 'test2'] }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: ['test1', 'test2'] }).not.toExtend<TestType>()
      expectTypeOf({ below: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ above: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ between: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: 'test' }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: 'test' }).not.toExtend<TestType>()
    })

    it('rejects numbers', () => {
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
    })

    it('rejects dates', () => {
      expectTypeOf({ anyOfIgnoreCase: [new Date()] }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ anyOfIgnoreCase: [false] }).not.toExtend<TestType>()
    })
  })

  describe('with a number', () => {
    type TestType = OpValueMap<number>

    it('accepts number ops', () => {
      expectTypeOf({ below: 1 }).toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 1 }).toExtend<TestType>()
      expectTypeOf({ above: 1 }).toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 1 }).toExtend<TestType>()
      expectTypeOf({ between: [1, 5] as ExactlyTwo<number> }).toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [1, 5] as ExactlyTwo<number> }).toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [1, 5] as ExactlyTwo<number> }).toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [1, 5] as ExactlyTwo<number> }).toExtend<TestType>()
    })

    it('accepts equality ops', () => {
      expectTypeOf({ equals: 1 }).toExtend<TestType>()
      expectTypeOf({ notEqual: 1 }).toExtend<TestType>()
    })

    it('accepts inclusion ops', () => {
      expectTypeOf({ anyOf: [1, 2] as AtLeastTwo<number> }).toExtend<TestType>()
      expectTypeOf({ noneOf: [1, 2] as AtLeastTwo<number> }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ equalsIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: 1 }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ equalsIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: 1 }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: 1 }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: 1 }).not.toExtend<TestType>()
    })

    it('rejects dates', () => {
      expectTypeOf({ below: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ above: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ between: [new Date(), new Date()] as ExactlyTwo<Date> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [new Date(), new Date()] as ExactlyTwo<Date> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [new Date(), new Date()] as ExactlyTwo<Date> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [new Date(), new Date()] as ExactlyTwo<Date> }).not.toExtend<TestType>()
      expectTypeOf({ equals: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [new Date(), new Date()] as AtLeastTwo<Date> }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [new Date(), new Date()] as AtLeastTwo<Date> }).not.toExtend<TestType>()
    })

    it('rejects strings', () => {
      expectTypeOf({ below: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ above: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ between: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ below: true }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: true }).not.toExtend<TestType>()
      expectTypeOf({ above: true }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: true }).not.toExtend<TestType>()
      expectTypeOf({ between: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
    })
  })

  describe('with a Date', () => {
    type TestType = OpValueMap<Date>

    it('rejects dates', () => {
      expectTypeOf({ below: new Date() }).toExtend<TestType>()
      expectTypeOf({ belowOrEqual: new Date() }).toExtend<TestType>()
      expectTypeOf({ above: new Date() }).toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: new Date() }).toExtend<TestType>()
      expectTypeOf({ between: [new Date(), new Date()] as ExactlyTwo<Date> }).toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [new Date(), new Date()] as ExactlyTwo<Date> }).toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [new Date(), new Date()] as ExactlyTwo<Date> }).toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [new Date(), new Date()] as ExactlyTwo<Date> }).toExtend<TestType>()
      expectTypeOf({ equals: new Date() }).toExtend<TestType>()
      expectTypeOf({ notEqual: new Date() }).toExtend<TestType>()
      expectTypeOf({ anyOf: [new Date(), new Date()] as AtLeastTwo<Date> }).toExtend<TestType>()
      expectTypeOf({ noneOf: [new Date(), new Date()] as AtLeastTwo<Date> }).toExtend<TestType>()
    })

    it('accepts equality ops', () => {
      expectTypeOf({ equals: new Date() }).toExtend<TestType>()
      expectTypeOf({ notEqual: new Date() }).toExtend<TestType>()
    })

    it('accepts inclusion ops', () => {
      expectTypeOf({ anyOf: [new Date(), new Date()] as AtLeastTwo<Date> }).toExtend<TestType>()
      expectTypeOf({ noneOf: [new Date(), new Date()] as AtLeastTwo<Date> }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ equalsIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ equalsIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: new Date() }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: new Date() }).not.toExtend<TestType>()
    })

    it('rejects number ops', () => {
      expectTypeOf({ below: 1 }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ above: 1 }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ between: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
    })

    it('rejects strings', () => {
      expectTypeOf({ below: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ above: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 'test1' }).not.toExtend<TestType>()
      expectTypeOf({ between: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: ['test1', 'test2'] as ExactlyTwo<string> }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ below: true }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: true }).not.toExtend<TestType>()
      expectTypeOf({ above: true }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: true }).not.toExtend<TestType>()
      expectTypeOf({ between: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [true, false] as ExactlyTwo<boolean> }).not.toExtend<TestType>()
    })
  })

  describe('with a number array', () => {
    type TestType = OpValueMap<number[]>

    it('accepts equality ops', () => {
      expectTypeOf({ equals: [1, 2] }).toExtend<TestType>()
      expectTypeOf({ notEqual: [1, 2] }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ equalsIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ equalsIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ below: 1 }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ above: 1 }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ between: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [1, 5] }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [1, 5] }).not.toExtend<TestType>()
    })

    it('rejects strings', () => {
      expectTypeOf({ equals: ['test1', 'test2'] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: ['test1', 'test2'] }).not.toExtend<TestType>()
    })

    it('rejects Dates', () => {
      expectTypeOf({ equals: [new Date(), new Date()] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: [new Date(), new Date()] }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ equals: [true, false] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: [true, false] }).not.toExtend<TestType>()
    })
  })

  describe('with a Date array', () => {
    type TestType = OpValueMap<Date[]>

    it('accepts equality ops', () => {
      expectTypeOf({ equals: [new Date(), new Date()] }).toExtend<TestType>()
      expectTypeOf({ notEqual: [new Date(), new Date()] }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ equalsIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ equalsIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ below: 1 }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ above: 1 }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ between: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [1, 5] }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [1, 5] }).not.toExtend<TestType>()
    })

    it('rejects numbers', () => {
      expectTypeOf({ equals: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: [1, 2] }).not.toExtend<TestType>()
    })

    it('rejects strings', () => {
      expectTypeOf({ equals: ['test1', 'test2'] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: ['test1', 'test2'] }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ equals: [true, false] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: [true, false] }).not.toExtend<TestType>()
    })
  })

  describe('with a mixed array', () => {
    type TestType = OpValueMap<(Date | string | number | (Date | string | number)[])[]>

    it('accepts equality ops', () => {
      expectTypeOf({ equals: [new Date(), 1, 'test'] }).toExtend<TestType>()
      expectTypeOf({ notEqual: [new Date(), 1, 'test'] }).toExtend<TestType>()
    })

    it('rejects other operators', () => {
      expectTypeOf({ equalsIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ equalsIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWith: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ startsWithIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ anyOfIgnoreCase: [1, 2] }).not.toExtend<TestType>()
      expectTypeOf({ below: 1 }).not.toExtend<TestType>()
      expectTypeOf({ belowOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ above: 1 }).not.toExtend<TestType>()
      expectTypeOf({ aboveOrEqual: 1 }).not.toExtend<TestType>()
      expectTypeOf({ between: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLower: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ betweenIncludeLowerAndUpper: [1, 5] as ExactlyTwo<number> }).not.toExtend<TestType>()
      expectTypeOf({ anyOf: [1, 5] }).not.toExtend<TestType>()
      expectTypeOf({ noneOf: [1, 5] }).not.toExtend<TestType>()
    })

    it('rejects booleans', () => {
      expectTypeOf({ equals: [true, false] }).not.toExtend<TestType>()
      expectTypeOf({ notEqual: [true, false] }).not.toExtend<TestType>()
    })
  })
})
