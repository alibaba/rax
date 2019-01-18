# rax-use-fetch

```jsx
import useFetch from 'rax-use-fetch';

const init = { method: 'GET' };

function Example() {
  const [data, error] = useFetch('https://httpbin.org/get', init, 'json');
  if (error) {
    return <p>error</p>
  } else if (data) {
    return <p>{data.foo}</p>
  } else {
    return <p>loading</p>
  }
}
```