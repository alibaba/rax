// @ts-ignore
import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import View from 'rax-view';
import Text from 'rax-text';
import api from '../src/';

const App = () => {
  const handleClick = () => {
    api();
  };
  return (
    // @ts-ignore
    <View onClick={handleClick}>
      <Text>click it!</Text>
    </View>
  );
};

render(<App />, null, { driver: DriverUniversal });
