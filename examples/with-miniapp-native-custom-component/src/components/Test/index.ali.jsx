import { createElement } from 'rax';
import View from 'rax-view';

import Test from '../../public/AliNativeComp/index';
import Title from 'mini-ali-ui/es/title/index';

export default function Home() {
  return (
    <View className="home">
      <Title
        hasLine={true}
        type="arrow"
        onActionTap={() => {
          console.log('标题被击中了');
        }}
      >我是 mini-ali-ui 的 title 组件</Title>
      <Test onClick={() => {
        console.log('我被击中了');
      }}>
        <View slot="header">我是 header</View>
        <View slot="footer">我是 footer</View>
      </Test>
    </View>
  );
}
