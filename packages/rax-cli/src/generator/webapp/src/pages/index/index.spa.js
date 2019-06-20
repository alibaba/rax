import { createElement, useState } from 'rax';

export default (props) => {
  const { router } = props;
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <div>
      <h1 onClick={handleClick}> Hello {name}</h1>
      <button onClick={() => router.history.push('/about')}>Go about</button>
    </div>
  );
};