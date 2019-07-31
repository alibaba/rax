import { createElement } from 'rax';
import './index.css';
import { usePageEffect } from '@core/page';

export default function Home() {
  usePageEffect('show', () => {

  });

  usePageEffect('hide', () => {

  });

  return (
    <div className="test">
      hello, world
    </div>
  )
}