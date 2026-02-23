import type { AtLeastTwo, ExactlyTwo } from '../src/utilityTypes'
import type { DexieWhereClause, FlatFieldCondition } from '../src'
import { getClauseHandlers } from '../src/clauseHandlers'

describe('getClauseHandlers', () => {
  type TestType = { testString: string, testNumber: number, testBoolean: boolean, testDate: Date }

  /**
   * Defines a test case. Useful for testing filter handlers for ops that support multiple value types.
   */
  type TestCase<ConditionValue = TestType[keyof TestType]> = {
    describe: string,
    field: keyof TestType,
    conditionValue: ConditionValue,
    passValues: TestType[keyof TestType][],
    failValues: TestType[keyof TestType][],
  }

  it('throws an error when attempting to use an unsupported QueryOp', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      // @ts-expect-error: intentional error
      op: 'unsupported',
      value: 'test',
    }

    expect(() => getClauseHandlers(condition)).toThrowError('Unsupported QueryOp')
  })

  describe('anyOfIgnoreCase', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      op: 'anyOfIgnoreCase',
      value: ['test1', 'TeSt2', 'TEST3'],
    }

    const { handleWhere, handleFilter } = getClauseHandlers(condition)

    describe('handleWhere', () => {
      it('calls anyOfIgnoreCase on the clause and returns the result', () => {
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

  describe('equals', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testString',
        op: 'equals',
        value: 'test',
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls equals on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          equals: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.equals).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<string | number | Date>[] = [
      {
        describe: 'handling strings',
        field: 'testString',
        conditionValue: 'test',
        passValues: ['test'],
        failValues: ['TEST', 'not equal'],
      },
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: 10,
        passValues: [10],
        failValues: [0, 1, 9],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: new Date('01/01/2001'),
        passValues: [new Date('01/01/2001')],
        failValues: [new Date(), new Date('11/11/2011')],
      },
    ]

    filterTestCases.forEach(testCase => {
      const condition: FlatFieldCondition<TestType> = {
        field: testCase.field,
        op: 'equals',
        value: testCase.conditionValue,
      }

      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value equals the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value does NOT equal the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('equalsIgnoreCase', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      op: 'equalsIgnoreCase',
      value: 'test',
    }

    const { handleWhere } = getClauseHandlers(condition)

    describe('handleWhere', () => {
      it('calls equalsIgnoreCase on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          equalsIgnoreCase: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.equalsIgnoreCase).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    describe('handleFilter', () => {
      const { handleFilter } = getClauseHandlers(condition)

      it('returns true when the object value equals the condition value, ignoring case', () => {
        expect(handleFilter('test')).toBe(true)
        expect(handleFilter('TEST')).toBe(true)
        expect(handleFilter('TeSt')).toBe(true)
      })

      it('returns false when the object value does NOT equal the condition value, ignoring case', () => {
        expect(handleFilter('not equal')).toBe(false)
      })
    })
  })

  describe('notEqual', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testString',
        op: 'notEqual',
        value: 'test',
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls notEqual on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          notEqual: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.notEqual).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<string | number | Date>[] = [
      {
        describe: 'handling string',
        field: 'testString',
        conditionValue: 'test',
        passValues: ['', 'other'],
        failValues: ['test'],
      },
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: 10,
        passValues: [0, 1, 11],
        failValues: [10],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: new Date('12/12/2012'),
        passValues: [new Date(), new Date('01/01/2001')],
        failValues: [new Date('12/12/2012')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'notEqual',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value does NOT equal the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value DOES equal the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('below', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'below',
        value: 10,
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls below on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          below: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.below).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<number | Date>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: 10,
        passValues: [-1, 0, 1, 5, 9, 9.5],
        failValues: [10, 11, 22, 33.3],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: new Date('11/11/2011'),
        passValues: [new Date('11/10/2011'), new Date('01/01/2001')],
        failValues: [new Date(), new Date('11/11/2011'), new Date('11/12/2011')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'below',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is below the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT below the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('belowOrEqual', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'belowOrEqual',
        value: 10,
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls belowOrEqual on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          belowOrEqual: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.belowOrEqual).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<number | Date>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: 10,
        passValues: [-1, 0, 1, 5, 9, 9.5, 10],
        failValues: [10.1, 11, 22, 33.3],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: new Date('11/11/2011'),
        passValues: [new Date('11/10/2011'), new Date('01/01/2001'), new Date('11/11/2011')],
        failValues: [new Date(), new Date('11/12/2011')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'belowOrEqual',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is below or equal to the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT below or equal to the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('above', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'above',
        value: 10,
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls above on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          above: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.above).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<number | Date>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: 10,
        passValues: [10.1, 11, 22, 33.3],
        failValues: [-1, 0, 1, 5, 9, 9.5, 10],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: new Date('11/11/2011'),
        passValues: [new Date(), new Date('11/12/2011')],
        failValues: [new Date('11/11/2011'), new Date('11/10/2011')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'above',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is above the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT above the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('aboveOrEqual', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'aboveOrEqual',
        value: 10,
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls aboveOrEqual on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          aboveOrEqual: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.aboveOrEqual).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<number | Date>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: 10,
        passValues: [10, 10.1, 11, 22, 33.3],
        failValues: [-1, 0, 1, 5, 9, 9.5],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: new Date('11/11/2011'),
        passValues: [new Date(), new Date('11/11/2011'), new Date('11/12/2011')],
        failValues: [new Date('11/10/2011')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'aboveOrEqual',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is above or equal the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT above or equal the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('between', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'between',
        value: [0, 5],
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls between on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          between: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.between).toHaveBeenCalledExactlyOnceWith(condition.value[0], condition.value[1], false, false)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<ExactlyTwo<number | Date>>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: [0, 5],
        passValues: [0.1, 2, 4.5],
        failValues: [-1, 0, 5, 5.1, 6],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: [new Date('01/01/2001'), new Date('01/10/2001')],
        passValues: [new Date('01/02/2001'), new Date('01/08/2001')],
        failValues: [new Date(), new Date('01/01/2001'), new Date('01/10/2001'), new Date('01/11/2001')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'between',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is between the lower and upper bounds', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT between the lower and upper bounds', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('betweenIncludeLower', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'betweenIncludeLower',
        value: [0, 5],
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls between on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          between: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.between).toHaveBeenCalledExactlyOnceWith(condition.value[0], condition.value[1], true, false)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<ExactlyTwo<number | Date>>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: [0, 5],
        passValues: [0, 0.1, 2, 4.5],
        failValues: [-1, 5, 5.1, 6],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: [new Date('01/01/2001'), new Date('01/10/2001')],
        passValues: [new Date('01/01/2001'), new Date('01/02/2001'), new Date('01/08/2001')],
        failValues: [new Date(), new Date('01/10/2001'), new Date('01/11/2001')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'betweenIncludeLower',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is between the lower and upper bounds (including lower)', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT between the lower and upper bounds (including lower)', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('betweenIncludeUpper', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'betweenIncludeUpper',
        value: [0, 5],
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls between on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          between: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.between).toHaveBeenCalledExactlyOnceWith(condition.value[0], condition.value[1], false, true)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<ExactlyTwo<number | Date>>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: [0, 5],
        passValues: [0.1, 2, 4.5, 5],
        failValues: [-1, 0, 5.1, 6],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: [new Date('01/01/2001'), new Date('01/10/2001')],
        passValues: [new Date('01/02/2001'), new Date('01/08/2001'), new Date('01/10/2001')],
        failValues: [new Date(), new Date('01/01/2001'), new Date('01/11/2001')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'betweenIncludeUpper',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is between the lower and upper bounds (including upper)', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT between the lower and upper bounds (including upper)', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('betweenIncludeLowerAndUpper', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'betweenIncludeLowerAndUpper',
        value: [0, 5],
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls between on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          between: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.between).toHaveBeenCalledExactlyOnceWith(condition.value[0], condition.value[1], true, true)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<ExactlyTwo<number | Date>>[] = [
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: [0, 5],
        passValues: [0, 0.1, 2, 4.5, 5],
        failValues: [-1, 5.1, 6],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: [new Date('01/01/2001'), new Date('01/10/2001')],
        passValues: [new Date('01/01/2001'), new Date('01/02/2001'), new Date('01/08/2001'), new Date('01/10/2001')],
        failValues: [new Date(), new Date('01/11/2001')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'betweenIncludeLowerAndUpper',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is included in the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT included in the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('in', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'in',
        value: [0, 5],
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls anyOf on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          anyOf: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.anyOf).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<AtLeastTwo<TestType[keyof TestType]>>[] = [
      {
        describe: 'handling strings',
        field: 'testString',
        conditionValue: ['test1', 'test2'],
        passValues: ['test1', 'test2'],
        failValues: ['', 'test', 'test3'],
      },
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: [-2.5, -1, 0, 1, 2],
        passValues: [-2.5, -1, 0, 1, 2],
        failValues: [-2, 2.5, 5],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: [new Date('01/01/2001'), new Date('11/11/2011')],
        passValues: [new Date('01/01/2001'), new Date('11/11/2011')],
        failValues: [new Date(), new Date('12/12/2012')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'in',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is between the lower and upper bounds (including lower and upper)', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is NOT between the lower and upper bounds (including lower and upper)', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('notIn', () => {
    describe('handleWhere', () => {
      const condition: FlatFieldCondition<TestType> = {
        field: 'testNumber',
        op: 'notIn',
        value: [0, 5],
      }

      const { handleWhere } = getClauseHandlers(condition)

      it('calls noneOf on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          noneOf: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.noneOf).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    const filterTestCases: TestCase<AtLeastTwo<TestType[keyof TestType]>>[] = [
      {
        describe: 'handling strings',
        field: 'testString',
        conditionValue: ['test1', 'test2'],
        passValues: ['', 'test', 'test3'],
        failValues: ['test1', 'test2'],
      },
      {
        describe: 'handling numbers',
        field: 'testNumber',
        conditionValue: [-2.5, -1, 0, 1, 2],
        passValues: [-2, 2.5, 5],
        failValues: [-2.5, -1, 0, 1, 2],
      },
      {
        describe: 'handling dates',
        field: 'testDate',
        conditionValue: [new Date('01/01/2001'), new Date('11/11/2011')],
        passValues: [new Date(), new Date('12/12/2012')],
        failValues: [new Date('01/01/2001'), new Date('11/11/2011')],
      },
    ]

    filterTestCases.forEach(testCase => {
      // eslint-disable-next-line vitest/valid-title
      describe(testCase.describe, () => {
        const condition: FlatFieldCondition<TestType> = {
          field: testCase.field,
          op: 'notIn',
          value: testCase.conditionValue,
        }

        describe('handleFilter', () => {
          const { handleFilter } = getClauseHandlers(condition)

          it('returns true when the object value is NOT included in the condition value', () => {
            testCase.passValues.forEach(value => {
              expect(handleFilter(value)).toBe(true)
            })
          })

          it('returns false when the object value is included in the condition value', () => {
            testCase.failValues.forEach(value => {
              expect(handleFilter(value)).toBe(false)
            })
          })
        })
      })
    })
  })

  describe('startsWith', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      op: 'startsWith',
      value: 'test',
    }

    describe('handleWhere', () => {
      const { handleWhere } = getClauseHandlers(condition)

      it('calls startsWith on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          startsWith: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.startsWith).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    describe('handleFilter', () => {
      const { handleFilter } = getClauseHandlers(condition)

      it('returns true for strings that start with the exact condition value', () => {
        expect(handleFilter('test')).toBe(true)
        expect(handleFilter('test1')).toBe(true)
      })

      it('returns false for strings that DO NOT start with the exact condition value', () => {
        expect(handleFilter('not-test')).toBe(false)
        expect(handleFilter('tEsT')).toBe(false)
        expect(handleFilter('TEST')).toBe(false)
        expect(handleFilter('tes')).toBe(false)
      })
    })
  })

  describe('startsWithIgnoreCase', () => {
    const condition: FlatFieldCondition<TestType> = {
      field: 'testString',
      op: 'startsWithIgnoreCase',
      value: 'test',
    }

    describe('handleWhere', () => {
      const { handleWhere } = getClauseHandlers(condition)

      it('calls startsWithIgnoreCase on the clause and returns the result', () => {
        const expectedResult = 'mock result'
        const clause = {
          startsWithIgnoreCase: vi.fn().mockReturnValue(expectedResult),
        } as unknown as DexieWhereClause<TestType>

        const result = handleWhere(clause)

        expect(clause.startsWithIgnoreCase).toHaveBeenCalledExactlyOnceWith(condition.value)
        expect(result).toEqual(expectedResult)
      })
    })

    describe('handleFilter', () => {
      const { handleFilter } = getClauseHandlers(condition)

      it('returns true for strings that start with the condition value, ignoring case', () => {
        expect(handleFilter('test')).toBe(true)
        expect(handleFilter('test1')).toBe(true)
        expect(handleFilter('tEsT')).toBe(true)
        expect(handleFilter('TEST')).toBe(true)
      })

      it('returns false for strings that DO NOT start with the condition value, ignoring case', () => {
        expect(handleFilter('not-test')).toBe(false)
        expect(handleFilter('tes')).toBe(false)
      })
    })
  })
})
