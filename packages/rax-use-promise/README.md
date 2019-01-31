# rax-use-promise

```jsx
import { createElement, useMemo } from 'rax';
import usePromise from 'rax-use-promise';

const fetchData = () => fetch('https://httpbin.org/get').then(res => res.json());

function Example() {
  const [data, error] = usePromise(useMemo(fetchData));
  if (error) {
    return <p>error</p>
  } else if (data) {
    return <p>{data.foo}</p>
  }
}
```
