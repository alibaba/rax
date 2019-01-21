# rax-use-fetch

```jsx
import { createElement, useMemo } from 'rax';
import usePromise from 'rax-use-promise';

function Example() {
  const fetchData = useMemo(() => fetch('https://httpbin.org/get').then(res => res.json()), []);
  const [data, error] = usePromise(fetchData);
  if (erro) {
    return <p>error</p>
  } else if (data) {
    return <p>{data.foo}</p>
  }
}
```