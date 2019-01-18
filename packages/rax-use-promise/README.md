# rax-use-promise

```jsx
import usePromise from 'rax-use-promise';

const fetchData = () => fetch('https://httpbin.org/get').then(res => res.json());

function Example() {
  const [data, error] = usePromise(fetchData);
  if (erro) {
    return <p>error</p>
  } else if (data) {
    return <p>{data.foo}</p>
  }
}
```