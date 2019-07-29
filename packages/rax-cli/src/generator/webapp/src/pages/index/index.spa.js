import { createElement, useState } from 'rax';
import { router } from 'rax-pwa';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <div>
      <h1 onClick={handleClick}> Hello {name}</h1>
      <button onClick={() => router.push('/about')}>Go about</button>
    </div>
  );
};
