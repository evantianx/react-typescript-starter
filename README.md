## React-TypeScript-Best-Practices

### Import React

By setting `"allowSyntheticDefaultImports": true`, we could import React just like in plain JavaScript:

```js
import React from 'react';
```

### Function Component

There are two options for FC:

```ts
// This option provides type-checking and autocomplete for static method
// Like: App.displayName, App.defaultProps etc
// Another advantage is that you could use children directly cause it has
// been implicted in React.FC
const App: React.FC<{ title: string }> = ({ title, children }) => (
  <div className='App'>
    <h1>{title} </h1>
    {children}
  </div>
);
```

```ts
type AppProps = { title: string };
const App = ({ title }: AppProps) => (
  <div className='App'>
    <h1>{title}</h1>
  </div>
);
```

### Hooks

> [React Hooks in TypeScript](https://medium.com/@jrwebdev/react-hooks-in-typescript-88fce7001d0d)

> [TypeScript and React: Hooks](https://fettblog.eu/typescript-react/hooks/)

#### `useState`

In most sceniros, we don't need any types for state like this:

```ts
const [user, setUser] = useState<IUser | null>(null);
```

or type inference:

```ts
// data's type inferred to be { foo: number, bar: number }
const [data, setData] = useState({ foo: 1, bar: 2 });
```

But sometimes we need to use the inferred type and don't want explicitly declare types/interfaces, we could do this below:

```ts
const [data, setData] = useState({ foo: 1, bar: 2 });

const formatData = (data: typeof data) => { ... }
// or use Partial Typed
const formatPartialData = (partialData: Partial<typeof data>) => {}
formatPartialData({ bar: 2 }) // works!
```

#### `useRef`

```ts
const ref1 = useRef<HTMLElement>(null); // ref1.current is immutable
const ref2 = useRef<HTMLElement | null>(null); // ref2.current is mutable
```

```ts
function TextInputWithFocusButton() {
  // initialise with null, but tell TypeScript we are looking for an HTMLInputElement
  const inputEl = React.useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // strict null checks need us to check if inputEl and current exist.
    // but once current exists, it is of type HTMLInputElement, thus it
    // has the method focus! ✅
    if (inputEl && inputEl.current) {
      inputEl.current.focus();
    }
  };
  return (
    <>
      {/* in addition, inputEl only can be used with input elements. Yay! */}
      <input ref={inputEl} type='text' />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

#### `useReducer`

> [Typing a useReducer React hook in TypeScript](https://www.sumologic.com/blog/react-hook-typescript/)

```ts
// check this online at stackblitz: https://stackblitz.com/edit/usereducer-typescript-state
import React, { Component, useState, useEffect, useReducer } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import axios from 'axios';
import './style.css';

type State =
  | { status: 'empty' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: HNResponse };

type HNResponse = {
  hits: {
    title: string;
    objectID: string;
    url: string;
  }[];
};

type Action =
  | { type: 'request' }
  | { type: 'success'; results: HNResponse }
  | { type: 'failure'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'request':
      return { status: 'loading' };
    case 'success':
      return { status: 'success', data: action.results };
    case 'failure':
      return { status: 'error', error: action.error };
  }
}

function App() {
  const [query, setQuery] = useState<string>();
  const [state, dispatch] = useReducer(reducer, { status: 'empty' });

  useEffect(() => {
    let ignore = false;

    dispatch({ type: 'request' });
    axios(`https://hn.algolia.com/api/v1/search?query=${query}`).then(
      results => {
        if (!ignore) dispatch({ type: 'success', results: results.data });
      },
      error => dispatch({ type: 'failure', error }),
    );

    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {state.status === 'loading' && <span>Loading...</span>}
      {state.status === 'success' && (
        <ul>
          {state.data &&
            state.data.hits &&
            state.data.hits.map(item => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
        </ul>
      )}
      {state.status === 'error' && <span>Error: {state.error}</span>}
    </div>
  );
}

render(<App />, document.getElementById('root'));
```

#### Custom Hooks

Mention: If you return an array in your custom hook, you need use `as` to declare the array as `const`:

```ts
export function useLoading() {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  return [isLoading, load] as const; // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}
```
