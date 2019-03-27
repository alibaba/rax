import {createElement, useState} from 'rax';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <text onClick={handleClick}>Hello {name}</text>
  );
};