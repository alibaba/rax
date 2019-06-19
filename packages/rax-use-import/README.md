# rax-use-import

```jsx
import { createElement } from 'rax';
import useImport from 'rax-use-import';

export default function App() {
  const [Bar, error] = useImport(() => import(/* webpackChunkName: "bar" */ './Bar'));
  if (error) {
    return <p>error</p>;
  } else if (Bar) {
    return <Bar />
  } else {
    return <p>loading</p>;
  }
}
```
