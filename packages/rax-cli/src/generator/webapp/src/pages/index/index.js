import {createElement, useState} from 'rax';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <h1 onClick={handleClick}> Hello {name}</h1>
  );
};
