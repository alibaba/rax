import { createElement, useState } from 'rax';
import View from 'rax-view';
// eslint-disable-next-line
import Test from 'plugin://myPlugin/test';

export default function Home() {
  function test(pluginName) {
    console.log(`${pluginName}被触发`);
  }
  return (
    <View className="home">
      {
        [1, 2, 3, 4, 5, 6].map(item => {
          return (
            <View key={item}>
              <Test
                onTest={test}
                pluginName={`插件 No.${item}`}
              />
            </View>
          );
        })
      }
    </View>
  );
}
