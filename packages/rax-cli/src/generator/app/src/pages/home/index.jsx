import './index.css';
import { createElement } from 'rax';
import { usePageEffect } from '@core/page';
// app should use Link in @core/router rather than rax-link
import { push, Link } from '@core/router';
import Text from 'rax-text';
import View from 'rax-view';
import Image from 'rax-image';

export default function Home() {
  usePageEffect('show', () => {

  });

  usePageEffect('hide', () => {

  });

  return (
    <View>
      <View className="header">

      </View>
      <Text>hello, world</Text>
      <Link to="/about">Link to about</Link>
      <View onClick={() => push('/about')}>
        <Text>Push to about</Text>
      </View>
    </View>
  );
}
