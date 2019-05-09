import { createElement, useState } from 'rax';
import View from 'rax-view';

export default () => {
  const [name, setName] = useState('world');
  const handleClick = () => {
    setName('rax');
  };
  return (
    <View onClick={handleClick}> Hello {name}</View>
  );
};
