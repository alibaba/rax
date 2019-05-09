import { createElement, useState } from 'rax';
import { push } from 'rax-use-router';

export default function Index() {
  return (
    <div>
      <h1>Index</h1>
      <button onClick={() => push('/foo')}>go foo</button>
      <button onClick={() => push('/bar')}>go bar</button>
      <button onClick={() => push('/xxxx')}>go 404</button>
    </div>
  );
}