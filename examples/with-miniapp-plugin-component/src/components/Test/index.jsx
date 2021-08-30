import { createElement } from 'rax';
import { isWeb, isMiniApp } from 'universal-env';
import View from 'rax-view';
import Text from 'rax-text';


export default function Home() {
  return (
    <View className="home">
      <Text className="title">这是 web 组件</Text>
    </View>
  );
}
