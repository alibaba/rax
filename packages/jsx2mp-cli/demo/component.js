import { createElement } from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import img from './assets/rax.png';

export default function Index() {
  return (
    <View>
      Hello World!
      <Image source={{ uri: img }} />
    </View>
  );
}
