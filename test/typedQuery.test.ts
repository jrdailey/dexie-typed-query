import { buildDb, buildUser, daysFromNow, now, resetDb } from '../test-helpers'
import { typedQuery } from '../src'

const db = buildDb()

const userOne = buildUser({
  createdAt: daysFromNow(-3),
  name: 'User One',
  loginAttempts: 3,
})
const userTwo = buildUser({
  createdAt: daysFromNow(-2),
  name: 'User Two',
  loginAttempts: 1,
})
const userThree = buildUser({
  createdAt: now(),
  name: 'User Three',
  loginAttempts: 4,
})
const seededUsers = [userOne, userTwo, userThree]

describe('typedQuery', () => {
  beforeEach(() => db.users.bulkAdd(seededUsers))
  afterEach(() => resetDb(db))
  afterAll(() => db.close())

  describe('.all', () => {
    it('returns all entities', async () => {
      const result = await typedQuery(db.users).all()

      expect(result.length).toEqual(3)
      expect(result).toEqual(expect.arrayContaining([userOne, userTwo, userThree]))
    })

    describe('query options', () => {
      it('can order results desc', async () => {
        const result = await typedQuery(db.users).all({ orderBy: { createdAt: 'desc' } })

        expect(result).toEqual([userThree, userTwo, userOne])
      })

      it('can order results asc', async () => {
        const result = await typedQuery(db.users).all({ orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userOne, userTwo, userThree])
      })

      it('can limit results', async () => {
        const result = await typedQuery(db.users).all({ limit: 1 })

        expect(result.length).toBe(1)
      })

      it('can offset results', async () => {
        const result = await typedQuery(db.users).all({ offset: 2 })

        expect(result.length).toBe(1)
      })

      it('can order and limit results', async () => {
        const result = await typedQuery(db.users).all({ limit: 2, orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userOne, userTwo])
      })

      it('can order and offset results', async () => {
        const result = await typedQuery(db.users).all({ offset: 1, orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userTwo, userThree])
      })

      it('can order, offset, and limit results', async () => {
        const result = await typedQuery(db.users).all({ offset: 1, limit: 1, orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userTwo])
      })
    })
  })

  describe('.where', () => {
    describe('query options', () => {
      it('can order results desc', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User T' },
        }, { orderBy: { createdAt: 'desc' } })

        expect(result).toEqual([userThree, userTwo])
      })

      it('can order results asc', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User T' },
        }, { orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userTwo, userThree])
      })

      it('can limit results', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User T' },
        }, { limit: 1 })

        expect(result.length).toBe(1)
      })

      it('can offset results', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User T' },
        }, { offset: 1 })

        expect(result.length).toBe(1)
      })

      it('can order and limit results', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User T' },
        }, { limit: 1, orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userTwo])
      })

      it('can order and offset results', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User T' },
        }, { offset: 1, orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userThree])
      })

      it('can order, offset, and limit results', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { belowOrEqual: now() },
        }, { offset: 1, limit: 1, orderBy: { createdAt: 'asc' } })

        expect(result).toEqual([userTwo])
      })
    })

    describe('equals', () => {
      it('can query strings', async () => {
        const result = await typedQuery(db.users).where({
          name: { equals: userOne.name },
        })

        expect(result).toEqual([userOne])
      })

      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { equals: userOne.loginAttempts },
        })

        expect(result).toEqual([userOne])
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { equals: userOne.createdAt },
        })

        expect(result).toEqual([userOne])
      })
    })

    describe('equalsIgnoreCase', () => {
      it('can query strings', async () => {
        const result = await typedQuery(db.users).where({
          name: { equalsIgnoreCase: userOne.name.toLowerCase() },
        })

        expect(result).toEqual([userOne])
      })
    })

    describe('notEqual', () => {
      it('can query strings', async () => {
        const result = await typedQuery(db.users).where({
          name: { notEqual: userOne.name },
        })

        expect(result.length).toBe(2)
        expect(result).toEqual(expect.arrayContaining([userTwo, userThree]))
      })

      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { notEqual: userOne.loginAttempts },
        })

        expect(result.length).toBe(2)
        expect(result).toEqual(expect.arrayContaining([userTwo, userThree]))
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { notEqual: userOne.createdAt },
        })

        expect(result.length).toBe(2)
        expect(result).toEqual(expect.arrayContaining([userTwo, userThree]))
      })
    })

    describe('below', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { below: 2 },
        })

        expect(result).toEqual([userTwo])
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { below: daysFromNow(-1) },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo]))
      })
    })

    describe('belowOrEqual', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { belowOrEqual: 3 },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo]))
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { belowOrEqual: daysFromNow(-2) },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo]))
      })
    })

    describe('above', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { above: 3 },
        })

        expect(result).toEqual([userThree])
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { above: daysFromNow(-3) },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userTwo, userThree]))
      })
    })

    describe('aboveOrEqual', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { aboveOrEqual: 3 },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userThree]))
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { aboveOrEqual: userTwo.createdAt },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userTwo, userThree]))
      })
    })

    describe('between', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { between: [0, 2] },
        })

        expect(result).toEqual([userTwo])
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { between: [daysFromNow(-5), userTwo.createdAt] },
        })

        expect(result).toEqual([userOne])
      })
    })

    describe('betweenIncludeLower', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { betweenIncludeLower: [1, 4] },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo]))
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { betweenIncludeLower: [userOne.createdAt, userTwo.createdAt] },
        })

        expect(result).toEqual([userOne])
      })
    })

    describe('betweenIncludeUpper', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { betweenIncludeUpper: [1, 4] },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userThree]))
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { betweenIncludeUpper: [userOne.createdAt, userTwo.createdAt] },
        })

        expect(result).toEqual([userTwo])
      })
    })

    describe('betweenIncludeLowerAndUpper', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { betweenIncludeLowerAndUpper: [1, 4] },
        })

        expect(result.length).toEqual(3)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo, userThree]))
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { betweenIncludeLowerAndUpper: [userOne.createdAt, userTwo.createdAt] },
        })

        expect(result.length).toEqual(2)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo]))
      })
    })

    describe('in', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { anyOf: [0, 1, 2, 5] },
        })

        expect(result).toEqual([userTwo])
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { anyOf: [daysFromNow(-5), daysFromNow(-1), userOne.createdAt] },
        })

        expect(result).toEqual([userOne])
      })
    })

    describe('notIn', () => {
      it('can query numbers', async () => {
        const result = await typedQuery(db.users).where({
          loginAttempts: { noneOf: [0, 1, 2, 4, 5] },
        })

        expect(result).toEqual([userOne])
      })

      it('can query dates', async () => {
        const result = await typedQuery(db.users).where({
          createdAt: { noneOf: [daysFromNow(-5), userOne.createdAt, userThree.createdAt] },
        })

        expect(result).toEqual([userTwo])
      })
    })

    describe('startsWith', () => {
      it('can query strings', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWith: 'User Tw' },
        })

        expect(result).toEqual([userTwo])
      })
    })

    describe('startsWithIgnoreCase', () => {
      it('can query strings', async () => {
        const result = await typedQuery(db.users).where({
          name: { startsWithIgnoreCase: 'user tw' },
        })

        expect(result).toEqual([userTwo])
      })
    })

    describe('ANDing clauses', () => {
      it('can AND clauses', async () => {
        const result = await typedQuery(db.users).where({
          and: [{
            createdAt: { between: [daysFromNow(-5), daysFromNow(-1)] },
          }, {
            name: { startsWith: 'User' },
          }, {
            loginAttempts: { below: 2 },
          }],
        })

        expect(result).toEqual([userTwo])
      })

      describe('query options', () => {
        it('can order results desc', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { between: [daysFromNow(-3), now()] },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userThree, userTwo])
        })

        it('can order results asc', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { between: [daysFromNow(-3), now()] },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { orderBy: { createdAt: 'asc' } })

          expect(result).toEqual([userTwo, userThree])
        })

        it('can limit results', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { between: [daysFromNow(-3), now()] },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { limit: 1 })

          expect(result.length).toBe(1)
        })

        it('can offset results', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { between: [daysFromNow(-3), now()] },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { offset: 1 })

          expect(result.length).toBe(1)
        })

        it('can order and limit results', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { between: [daysFromNow(-3), now()] },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { limit: 1, orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userThree])
        })

        it('can order and offset results', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { between: [daysFromNow(-3), now()] },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { offset: 1, orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userTwo])
        })

        it('can order, offset, and limit results', async () => {
          const result = await typedQuery(db.users).where({
            and: [{
              createdAt: { belowOrEqual: now() },
            }, {
              name: { startsWith: 'User T' },
            }],
          }, { offset: 1, limit: 1, orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userTwo])
        })
      })
    })

    describe('ORing clauses', () => {
      it('can OR clauses', async () => {
        const result = await typedQuery(db.users).where({
          or: [{
            createdAt: { equals: userOne.createdAt },
          }, {
            name: { equals: userTwo.name },
          }, {
            loginAttempts: { above: 3 },
          }],
        })

        expect(result.length).toEqual(3)
        expect(result).toEqual(expect.arrayContaining([userOne, userTwo]))
      })

      describe('query options', () => {
        it('can order results desc', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }],
          }, { orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userTwo, userOne])
        })

        it('can order results asc', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }],
          }, { orderBy: { createdAt: 'asc' } })

          expect(result).toEqual([userOne, userTwo])
        })

        it('can limit results', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }],
          }, { limit: 1 })

          expect(result.length).toBe(1)
        })

        it('can offset results', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }],
          }, { offset: 1 })

          expect(result.length).toBe(1)
        })

        it('can order and limit results', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }],
          }, { limit: 1, orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userTwo])
        })

        it('can order and offset results', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }],
          }, { offset: 1, orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userOne])
        })

        it('can order, offset, and limit results', async () => {
          const result = await typedQuery(db.users).where({
            or: [{
              createdAt: { equals: userOne.createdAt },
            }, {
              name: { equals: userTwo.name },
            }, {
              loginAttempts: { equals: userThree.loginAttempts },
            }],
          }, { offset: 1, limit: 1, orderBy: { createdAt: 'desc' } })

          expect(result).toEqual([userTwo])
        })
      })
    })
  })
})
