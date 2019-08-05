import './index.css';
import { createElement } from 'rax';
import View from 'rax-view';

export default ({ children }) => {
  return (
    <View className="panel">
      {children}
    </View>
  );
};
