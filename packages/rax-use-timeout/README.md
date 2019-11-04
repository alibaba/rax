# rax-use-timeout

Why `useTimeout`? `setTimeout` will called even component is unmounted that make error happens, and `useTimeout` will auto `clearTimeout` before component will mount.

```jsx
import { createElement } from 'rax';
import useTimeout from 'rax-use-timeout';

function Example() {
  const [count, setCount] = useState(0);
  useTimeout(() => {
    setCount(count + 1);
  }, 1000);

  return <h1>{count}</h1>;
}
```