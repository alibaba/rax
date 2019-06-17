import { createElement, useState } from 'rax';
import { push } from 'rax-use-router';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <div>
      <button onClick={() => push('/hello')}>Go hello</button>
      <h1 onClick={handleClick}> Hello {name}</h1>
    </div>
  );
};