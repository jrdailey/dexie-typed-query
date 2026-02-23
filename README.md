![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Coverage total](./badges/coverage-total.svg)

# Dexie Typed Query
Dexie is great, but its TypeScript support and query interface leave something to be desired.

This project aims to alleviate this by offering a lightweight, type-safe query wrapper.

## Introduction
### Example
With vanilla Dexie:

```typescript
const query = await db.users.where('name')
  .startsWith('T')
  .and(u => u.createdAt < new Date())
  .reverse()
  .sortBy('createdAt')

const result = query.slice(10, 20)
```

With dexie-typed-query:

```typescript
const result = await typedQuery(db.users).where({
  and: [{
    name: { startsWith: 'T' },
  }, {
    createdAt: { below: new Date() },
  }],
}, { offset: 10, limit: 10, orderBy: { createdAt: 'desc' } })
```

### Features
- __Declarative query interface__: Replace complex method chains with a single, readable query object.
- __Simplified Pagination__: Specify offsets and limits for your queries.
- __Easy Adoption__: Drop it into an existing Dexie project without refactoring your entire database layer.
- __Deep Type Safety__:
  - __Property-aware operators__: Only see operators that make sense for your data type (e.g., no `startsWith` on numbers/dates).
  - __Validated condition values__: The type system takes into account both the property type and the selected operator. For example, using `between` on a date property will require a tuple of dates.
- __Lightweight__: Zero dependencies (only a peer dependency on Dexie).
- __Production Ready__: 100% test coverage.

### Caveats
This is not a complete replacement for Dexie. It should work for most everyday queries, but you may still need to use vanilla Dexie for more advanced queries.

## Installation
Requirements: `dexie@^4.0.0`

```bash
npm install dexie-typed-query
```

## Usage
Note: This assumes you are [using TypeScript to define your Dexie table interfaces](https://dexie.org/docs/Typescript).

### Basic Querying
```typescript
import { typedQuery } from 'dexie-typed-query'

const query = typedQuery(db.someTable)

const result = await query.where({ someField: { equals: 'test' } })
```
_Note: The queried field must be an indexed field. If a non-indexed field is used, Dexie will throw an error._

### Query Options
An optional QueryOptions object can be passed as the second argument to the `where` function to handle pagination (offset, limit) and sorting (orderBy, ascending or descending).

```typescript
const result = await typedQuery(db.someTable).where({
  someField: { equals: 'test' }
}, { offset: 5, limit 5, orderBy: { createdAt: 'desc' } })
```
_Note: Both the queried field and `orderBy` field must be indexed fields. If a non-indexed field is used, Dexie will throw an error._

### ANDing

Multiple query objects can be ANDed together.

```typescript
const result = await typedQuery(db.users).where({
  and: [{
    name: { startsWith: 'T' },
  }, {
    createdAt: { below: new Date() },
  }],
})
```
_Note: The first query object must be for an indexed field. If a non-indexed field is used, Dexie will throw an error. Under the hood, all subsequent query objects will use Dexie's `filter` function._

### ORing

Multiple query objects can be ORed together.

```typescript
const result = await typedQuery(db.users).where({
  or: [{
    createdAt: { equals: userOne.createdAt },
  }, {
    name: { equals: userTwo.name },
  }],
})
```
_Note: Each query object must be for an indexed field. If a non-indexed field is used, Dexie will throw an error._

### Available Operators
| Operator | Description | Supported Types |
| ------------ | --------------------------------------------------- | --------------- |
| `above` | Selects items where the field value is above the given lower bound | number, Date |
| `aboveOrEqual` | Selects items where the field value is above or equal to the given lower bound | number, Date |
| `anyOfIgnoreCase` | Selects items where the field value contains any of the given values, ignoring case | string |
| `below` | Selects items where the field value is below the given upper bound | number, Date |
| `belowOrEqual` | Selects items where the field value is below or equal to the given upper bound | number, Date |
| `between` | Selects items where the field value is between the given lower and upper bounds, not including the lower and upper bounds | number, Date |
| `betweenIncludeLower` | Selects items where the field value is between the given lower and upper bounds, including the lower bound and excluding the upper bound | number, Date |
| `betweenIncludeLowerAndUpper` | Selects items where the field value is between the given lower and upper bounds, including the lower and upper bound | number, Date |
| `betweenIncludeUpper` | Selects items where the field value is between the given lower and upper bounds, including the upper bound and excluding the lower bound | number, Date |
| `equals` | Selects items where the field value is equal to the given value | string, number, Date, array of string/number/Date |
| `equalsIgnoreCase` | Selects items where the field value is equal to the given value, ignoring case | string |
| `in` | Selects items where the field value contains any of the given values | string, number, Date, array of string/number/Date |
| `notEqual` | Selects items where the field value is NOT equal to the given value | string, number, Date, array of string/number/Date |
| `notIn` | Selects items where the field value does NOT contain any of the given values | string, number, Date, array of string/number/Date |
| `startsWith` | Selects items where the field value starts with the given prefix | string |
| `startsWithIgnoreCase` | Selects items where the field value starts with the given prefix, ignoring case | string |

## License

This project is licensed under the MIT License - see the LICENSE file for details
