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

How to stop or restart timer?
```jsx
function Example() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  useTimeout(() => {
    setCount(count + 1);
  }, delay);

  const stopTimer = () => setDelay(null); // Stop
  const restartTimer = () => setDelay(1000); // Restart

  return <h1 onClick={delay ? stopTimer : restartTimer}>{count}</h1>;
}
```