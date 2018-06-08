# rax-console

```js
import {createElement, render} from 'rax';
import Console from 'rax-console';

var console = render(<Console style={{height: 500, position: 'absolute', left: 0, right: 0, bottom: 0}}/>);
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