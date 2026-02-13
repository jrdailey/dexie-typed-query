import type { AtLeastTwo, ExactlyOne, ExactlyOneKey, ExactlyTwo, SingleRecord, StringKeyOf } from '../src/utilityTypes'
import { expectTypeOf } from 'vitest'

describe('StringKeyOf', () => {
  it('returns keys when they are all strings', () => {
    type TestType = { one: string, two: string }

    expectTypeOf<StringKeyOf<TestType>>().toEqualTypeOf<'one' | 'two'>()
  })

  it('filters out non-string keys', () => {
    const sym = Symbol('id')
    type TestType = { string: string, 1: number, [sym]: boolean }

    expectTypeOf<StringKeyOf<TestType>>().toEqualTypeOf<'string'>()
  })

  it('handles empty object', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<StringKeyOf<{}>>().toBeNever()
  })
})

describe('ExactlyOne', () => {
  it('accepts a singular instance of T', () => {
    expectTypeOf<1>().toExtend<ExactlyOne<number>>()
  })

  it('rejects an array of T', () => {
    expectTypeOf<[1]>().not.toExtend<ExactlyOne<number>>()
  })
})

describe('ExactlyTwo', () => {
  it('accepts a two-element array of T', () => {
    expectTypeOf<[1, 2]>().toExtend<ExactlyTwo<number>>()
  })

  it('rejects an empty array', () => {
    expectTypeOf<[]>().not.toExtend<ExactlyTwo<number>>()
  })

  it('rejects a one-element array', () => {
    expectTypeOf<[1]>().not.toExtend<ExactlyTwo<number>>()
  })

  it('rejects a many-element array of T', () => {
    expectTypeOf<[1, 2, 3, 4, 5]>().not.toExtend<ExactlyTwo<number>>()
  })
})

describe('AtLeastTwo', () => {
  it('accepts a two-element array of T', () => {
    expectTypeOf<[1, 2]>().toExtend<AtLeastTwo<number>>()
  })

  it('accepts a many-element array of T', () => {
    expectTypeOf<[1, 2, 3, 4, 5]>().toExtend<AtLeastTwo<number>>()
  })

  it('rejects an empty array', () => {
    expectTypeOf<[]>().not.toExtend<AtLeastTwo<number>>()
  })

  it('rejcts a one-element array', () => {
    expectTypeOf<[1]>().not.toExtend<AtLeastTwo<number>>()
  })
})

describe('ExactlyOneKey', () => {
  type OneKey = ExactlyOneKey<{ one: number, two: number, three: number }>

  it('accepts a one-key object', () => {
    expectTypeOf<{ one: 1 }>().toExtend<OneKey>()
  })

  it('rejects a multi-key object', () => {
    expectTypeOf<{ one: 1, two: 2, three: 3 }>().not.toExtend<OneKey>()
  })

  it('rejects an empty object', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().not.toExtend<OneKey>()
  })
})

describe('SingleRecord', () => {
  const sym = Symbol('sym')
  type Single = SingleRecord<'a' | 'b' | 1 | symbol, number>

  it('accepts a singular string-key record', () => {
    expectTypeOf<{ a: 1 }>().toExtend<Single>()
  })

  it('accepts a singular number-key record', () => {
    expectTypeOf<{ 1: 1 }>().toExtend<Single>()
  })

  it('accepts a singular sym-key record', () => {
    expectTypeOf<{ [sym]: 1 }>().toExtend<Single>()
  })

  it('rejects multi-key records', () => {
    expectTypeOf<{ a: 1, b: 2 }>().not.toExtend<Single>()
    expectTypeOf<{ a: 1, 1: 2 }>().not.toExtend<Single>()
    expectTypeOf<{ a: 1, [sym]: 2, 1: 3 }>().not.toExtend<Single>()
  })
})
