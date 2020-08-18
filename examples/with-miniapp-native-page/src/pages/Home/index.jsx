import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

import './index.css';

import Logo from '../../components/Logo';

export default function Home() {
  return (
    <View className="home">
      <Logo uri="//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png" />
      <Text className="title">Welcome to Your Rax App</Text>
      <Text className="info">More information about Rax</Text>
      <Text className="info">Visit https://rax.js.org</Text>
    </View>
  );
}
