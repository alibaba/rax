import { createElement, useState } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
// eslint-disable-next-line
import Plugin from 'plugin://myPlugin/hello-component';

export default function Home() {
  function test(pluginName) {
    console.log(`${pluginName}被触发`);
  }
  const list = [1, 2, 3];
  return (
    <View className="home">
      {
        [1, 2, 3, 4, 5, 6].map(item => {
          return (
            <View key={item}>
              <Plugin list={list} onTest={() => {
                test(item);
              }} />
            </View>
          );
        })
      }

    </View>
  );
}
