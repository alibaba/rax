import './index.css';
import { createElement } from 'rax';
import { usePageEffect } from '@core/page';
// app should use Link in @core/router rather than rax-link
import { push, Link } from '@core/router';
import Text from 'rax-text';
import View from 'rax-view';

export default function Home() {
  usePageEffect('show', () => {

  });

  usePageEffect('hide', () => {

  });

  return (
    <View className="home">
      <Text>hello, world</Text>
      <Link to="/about">Link to about</Link>
      <View onClick={() => push('/about')}>push to about</View>
    </View>
  );
}
