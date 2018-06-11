# rax-console

```js
import {createElement, render} from 'rax';
import Console from 'rax-console';

var console = render(<Console />);
console.addMessage({
  source: 'console-api',
  type: 'log',
  level: 'error',
  parameters: ['hello error'],
});

console.addMessage({
  source: 'console-api',
  type: 'log',
  level: 'warn',
  parameters: ['hello warn', 123],
});

console.addMessage({
  source: 'console-api',
  type: 'log',
  level: 'log',
  parameters: ['hello log', { foo: 'bar'}],
});
```