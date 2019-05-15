import { createElement } from 'rax';
import View from 'rax-view';

const defaultColor = {
  background: 'yellow',
};

export default (props) => {
  return (
    <View onClick={props.onClick} style={defaultColor}>Primary Button</View>
  );
};
