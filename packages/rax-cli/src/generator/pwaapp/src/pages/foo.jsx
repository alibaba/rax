import { createElement, useState } from 'rax';
import { replace } from 'rax-use-router';

export default (props) => {
  return (
    <div>
      <h1>Foo</h1>
      <button onClick={() => replace('/home')}>Go home</button>
    </div>
  );
};