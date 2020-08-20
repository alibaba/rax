import { createElement } from 'rax';
import View from 'rax-view';

import Test from '../../public/WechatNativeComp/index';

export default function Home() {
  return (
    <View className="home">
      <Test onClick={() => {
        console.log('我被击中了');
      }}>
        <View slot="header">我是 header</View>
        <View slot="footer">我是 footer</View>
      </Test>
    </View>
  );
}
