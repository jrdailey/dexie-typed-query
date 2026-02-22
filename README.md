# Dexie Typed Query
Dexie is great, but its TypeScript support and query interface leave something to be desired.

This project aims to alleviate this by offering a lightweight, type-safe query wrapper.

## Introduction
### Example
With vanilla Dexie:

```typescript
const query = await db.users.where('name')
  .startsWith('T')
  .and(u => u.createdAt <= new Date())
  .reverse()
  .sortBy('createdAt')

const result = query.slice(1).slice(0, 1)
```

With dexie-typed-query:

```typescript
const result = await typedQuery(db.users).where({
  and: [{
    name: { startsWith: 'T' },
  }, {
    createdAt: { belowOrEqual: new Date() },
  }],
}, { offset: 1, limit: 1, orderBy: { createdAt: 'desc' } })
```

### Features
- __Declarative query interface__: Replace complex method chains with a single, readable query object.
- __Easy Adoption__: Drop it into an existing Dexie project without refactoring your entire database layer.
- __Deep Type Safety__:
  - __Property-aware 0perators__: Only see operators that make sense for your data type (e.g., no `startsWith` on numbers/dates).
  - __Validated condition values__: The type system takes into account both the property type and the selected operator. For example, using `between` on a date property will require a tuple of dates.
- __Lightweight__: Zero dependencies (only a peer dependency on Dexie).
- __Production Ready__: 100% test coverage.

### Caveats
This is not a replacement for Dexie, and you may still need to use vanilla Dexie for more advanced queries.

## Installation
Requirements: `dexie@^4.0.0`

```bash
npm install dexie-typed-query
```

## Usage
TODO

## License

This project is licensed under the MIT License - see the LICENSE file for details