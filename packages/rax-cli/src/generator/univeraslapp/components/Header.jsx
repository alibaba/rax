import { createElement } from 'rax';
import View from 'rax-view';
import './Header.css';

export default function Header(props) {
  return (
    <View className="header">
      {props.children}
    </View>
  );
}
