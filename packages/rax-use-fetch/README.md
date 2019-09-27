# rax-use-fetch

```jsx
import { createElement } from 'rax';
import useFetch from 'rax-use-fetch';

function Example() {
  const [data, error] = useFetch('https://httpbin.org/get');
  if (error) {
    return <p>error</p>
  } else if (data) {
    return <p>{data.foo}</p>
  } else {
    return <p>loading</p>
  }
}
```