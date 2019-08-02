import './index.css';
import { createElement } from 'rax';
import Text from 'rax-text';
import View from 'rax-view';

export default () => {
  return (
    <View className="info">
      <Text>Go to https://rax.js.org see more information</Text>
    </View>
  );
};
