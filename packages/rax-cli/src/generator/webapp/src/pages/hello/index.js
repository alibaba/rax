import { createElement, useState } from 'rax';
import { push } from 'rax-use-router';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('PWA');
  };
  return (
    <div>
      <button onClick={() => push('/index')}>Go home</button>
      <h1 onClick={handleClick}> Hello Rax {name}</h1>
    </div>
  );
};