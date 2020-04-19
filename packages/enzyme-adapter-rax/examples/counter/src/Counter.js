// eslint-disable-next-line import/no-extraneous-dependencies
import { createElement, useState } from 'rax';

export default function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(count + 1);
  return (
    <button onClick={increment}>
      Current value: {count}
    </button>
  );
}
