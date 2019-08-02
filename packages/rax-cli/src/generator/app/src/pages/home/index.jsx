import { createElement } from 'rax';
import './index.css';
import { usePageEffect } from '@core/page';
import { push } from '@core/router';

export default function Home() {
  usePageEffect('show', () => {

  });

  usePageEffect('hide', () => {

  });

  return (
    <div className="test">
      hello, world
      <a onClick={() => push('/about')} />
      <button onClick={() => push('/about')}>Go about</button>
    </div>
  );
}