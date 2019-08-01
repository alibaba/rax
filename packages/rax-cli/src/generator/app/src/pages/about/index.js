import { createElement } from 'rax';
import { push } from '@core/router';

export default () => {
  return (
    <div>
      <h1>Hello Rax</h1>
      <p>Go to https://rax.js.org see more information</p>
      <button onClick={() => push('/page1')}>Go home</button>
    </div>
  );
};