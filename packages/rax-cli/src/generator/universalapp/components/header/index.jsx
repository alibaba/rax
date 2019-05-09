import { createElement } from 'rax';
import View from 'rax-view';
import './index.css';

export default function(props) {
  return (
    <View className="header">
      {props.children}
    </View>
  );
}
