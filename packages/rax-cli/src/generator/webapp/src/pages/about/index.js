import { createElement } from 'rax';
import { push } from 'rax-use-router';

export default (props) => {
  return (
    <div>
      <h1> Hello Rax PWA</h1>
      <p>Modify the configuration of app.json, turn on the PWA features.</p>
      <button onClick={() => push('/index')}>Go home</button>
    </div>
  );
};