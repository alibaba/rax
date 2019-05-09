import { createElement, useState } from 'rax';
import Header from '../../components/header/index';
import View from 'rax-view';
import Text from 'rax-text';
import Image from 'rax-image';
import './index.css';

export default function(props) {
  const [ name, setName ] = useState('Rax');
  const handleClick = () => {
    setName('MiniApp');
  };
  return (
    <View className="app">
      <Header>
        <Image mode="widthFix" src="https://gw.alicdn.com/tfs/TB1omutPwHqK1RjSZFkXXX.WFXa-498-498.png" className="logo" />
        <Text className="title" onClick={handleClick}>Welcome to {name}</Text>
      </Header>
      <Text class="intro">To get started, edit and rebuild.</Text>
    </View>
  );
}
