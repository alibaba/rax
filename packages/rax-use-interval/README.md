# rax-use-interval

Why `useInterval`? `setInterval` will called even component is unmounted that make error happens, and `useInterval` will auto `clearInterval` before component will mount.

```jsx
import { createElement } from 'rax';
import useInterval from 'rax-use-interval';

function Example() {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, 1000);

  return <h1>{count}</h1>;
}
```