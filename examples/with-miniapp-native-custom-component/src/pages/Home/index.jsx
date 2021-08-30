import { createElement } from 'rax';
import View from 'rax-view';

import './index.css';
import Test from '../../components/Test';

export default function Home() {
  return (
    <View className="home">
      <Test />
    </View>
  );
}
