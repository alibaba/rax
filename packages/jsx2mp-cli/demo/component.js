import { createElement } from 'rax';
import View, { custom } from 'rax-view';
import Image from 'rax-image';
import img from './assets/rax.png';

const a = 0;
const b = 1;

export default function Index() {
  custom();
  return (
    <View>
      Hello World!
      <Image source={{ uri: img }} c={a && b} d={img ? a : b} />
    </View>
  );
}
