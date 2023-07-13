# FETCH CLIENT

The goal of the library is to connect existing types for each endpoint and create type-safe tool to ping our API.

The simple usage looks as follows:

```typescript
import { FetchClient } from 'fetch-rest-ts'

type Schema = {
  users: {
    get: {
      input: {
        firstName: 'Bob',
        lastName: 'Smith',
      }
      output: UserEntity,
    }
  }
}

const fetchClient = new FetchClient<Schema>({
  baseUrl: 'http://blabla/'
})

const user = fetchClient.get('users', { 
  firstName: 'Bob',
  lastName: 'Smith',
})
```

## Type definition

Let's take a look type definition at first: 
```typescript
export type Schema = {
  [model: string]: {
    [method: string]: {
      pathParams?: unknown
      input?: unknown
      output?: unknown
    }
  }
}
```

where `model` is path to API controller and `method` is usually one of `get | create | update | delete`, but can be [any string](#advanced).

Following our initial example with method `create` on  model `users` types definition should look as follows:

```typescript

type User = {
  id: string
  firstName: string
  lastName?: string
}
export type Schema = {
  users: {
    create: {
      input: {
        firstName: string
        lastName?: string
      }
      output: User
    }
  }
}
```

So the `create` request will have:

```typescript
const user = await fetchClient.create('users', { 
  firstName: 'Bob',
  lastName: 'Smith',
}) // res is type of 'output' -> User
```
second parameter of `create` is checked for `'input'` -> `{firstName: string; lastName?: string }`.

That means we have:
```typescript
fetchClient.create('users', {
  firstName: 'Bob',
}) // ok ✅ 'lastName' is optional

fetchClient.create('users', {
  lastName: 'Smith',
}) // wrong ❌ -> 'firstName' is marked as required.
```

## Methods
Exported client exposes 4 methods to the user `[create, update, get, delete]`.

### Mutations
As we may pass information to API with both url path or `body` parameter clients provides a way to pass those data in type-safe meaner.

The API route may be built with simple string like `users` or expect same value inside, ex.: `users/:id`.

To address this pattern, lets look at update example: 

```typescript
fetchClient.update('users/:id', {
  pathParams: {
    id: '1',
  },
  body: {
    lastName: 'Kowalski',
  }
})

// that resolves to:
fetch('/user/1', {
  method: 'PATCH',
  body: JSON.stringify({
    lastName: 'Kowalski',
  })
})

```

The above example validates each key for corresponding type definition in `Model`, and in our example `Model['user']['update']`. `pathParams` is checked against `Model['user']['update']['pathParams']` where `body` is checked against `Model['user']['update']['input']`. So the updated `Model` should look like:
```typescript
export type Schema = {
  users: {
    ':/id': {
      update: {
        pathParams: {
          id: string
        }
        input: {
          lastName?: string,
          firstName?: string,
        }
        output: User
      }
    }
    
  }
}
```

All mutations (`create`, `update` and `delete`) takes second parameter as the example.

#### Code sugar
In most cases only one of `body` and `pathParams` is used. Moreover, it is rare case to case an error passing additional parameters from `pathParams` to `body`.
Therefore, second parameter of mutation can be passed directly without defining `body` or `pathParams` keys. So the `update` method will be: 

```typescript
fetchClient.update('users/:id', {
  id: '1',
  lastName: 'Kowalski',
})

// that resolves to:
fetch('/user/1', {
  method: 'PATCH',
  body: JSON.stringify({
    id: '1',
    lastName: 'Kowalski',
  })
})
```

### Get
When using HTTP `GET` method, passing information via `body` is a no-no, but the query params are a way to go. From usage of the client, there is almost nothing changes. As a result the parameter may contain `query` instead of `body`.

```typescript
// standard
fetchClient.get('users/:id', {
  pathParams: {
    id: '1',
  },
  query: {
    lastName: 'Kowalski',
  }
})

// with code sugar
fetchClient.get('users/:id', {
  id: '1',
  lastName: 'Kowalski',
})

// that resolves to:
fetch('/user/1?id=1&lastName=Kowalski', {
  method: 'GET',
})
```
The example check the `Model` for a `get` method and checks types for both `input` and `pathParams` in the same pattern as in mutation.

## Advanced
### Defaults
When using `get` our `Model` should finally look like:


```typescript
type UserInput = {
  firstName: string
  lastName?: string
}

type UserOutput = {
  id: string
  firstName: string
  lastName?: string
}

export type Schema = {
  users: {
    create: {
      input: UserInput
      output: UserOutput
    }
    update: {
      pathParams: {
        id: string
      }
      input: UserInput
      output: UserOutput
    }
    get: {
      pathParams: {
        id: string
      }
      input: {
        lastName?: string
      }
      output: UserOutput
    }
  }
}
```

### Additional GET routes
It's not uncommon to see a few `GET` routes under one common path ex:
- GET `/user` returns all `User[]`
- GET `/user/:id` returns single `User` with provided `id`

Calling client `.get` method will look very similar, but different types may be required (ex. for `output`).

In `Model`, add whatever method you wish and define expected types. Most common should be `list` with array as an `output`:
```typescript
type User = {
  id: string
  firstName: string
  lastName?: string
}

export type Schema = {
  users: {
    get: {
      output: User
    }
    // ...
    list: {
      output: User[]
    }
  }
}
```

Last, inform client to use different method:

```typescript
fetchClient.get('users', { method: 'list' }) // default to `get`
```

### Nested paths
It's common practice to organize API endpoints in structured pattern, nesting each connected resource under another.
For example to get user contact info the endpoint may look like: 
1. `/contact` without nesting
2. `/users/contact/:id` under `users` path

Flat structures are quite simple, but nested one... 

`Schema` declaration allow to nest connected resources as well:
```typescript
export type Schema = {
  users: {
    create: {
      input: UserInput
      output: UserOutput
    }
    '/contact': {
      '/:id': {
        get: {
          pathParams: { id: string }
          output: UserContactOutput
        }
      }
    }
  }
}

const res = await fetchClient.get('users/contact/:id', { id: 1 })
// res has UserContactOutput type
// { id: 1 } is validated with coresponding type
```

**Note** - nested paths should start with `/` character.


## Hooks
Fetching data from `client side` is sometimes useful and using ReactQuery allows us to follow best practices when doing so.

Exported hooks `useCreate`, `useUpdate`, `useDelete` and `useGet` wraps `fetchClient` with ReactQuery and pass model as a mutations key and invalidated queries on mutation success.

First run:
```bash
npm install @tanstack/react-query
```
