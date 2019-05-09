// Bar.jsx
import { createElement, useState } from 'rax';
import { push } from 'rax-use-router';

export default function Bar() {
  const [name, setName] = useState('123');
  const handleClick = () => {
    setName('rax');
  };
  return (
    <div>
      <h1 onClick={handleClick}>Bar</h1>
      <button onClick={() => push('/home')}>Go home {name}</button>
    </div>
  );
}