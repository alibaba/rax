import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

import Main from '../../components/Main';

export default function Home() {
  return (
    <View className="about">
      <View className="box">
        <Text className="info">check the</Text>
        <Link className="info" href="https://rax.js.org" target="__blank">
          Rax Documation
        </Link>
      </View>
      <View className="box">
        <Link className="info" href="/">
          Go back
        </Link>
      </View>
    </View>
  );
}
