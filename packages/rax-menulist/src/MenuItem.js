import {createElement, Component} from 'rax';
import Text from 'rax-text';
import TouchableHighlight from 'rax-touchable';
import View from 'rax-view';
import StyleSheet from 'universal-stylesheet';

export default class MenuItem extends Component {
  render() {
    const {title, titleStyle, onPress, style, children} = this.props;
    const content = children ? children : (
      <Text style={[menuItemStyle.text, titleStyle]}>{title}</Text>
    );

    return (
      <TouchableHighlight
        style={[menuItemStyle.item, style]}
        onPress={onPress}
      >
        {content}
      </TouchableHighlight>
    );
  }
}

const menuItemStyle = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e7e7e7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 15,
    paddingBottom: 15
  },
  text: {
    fontSize: 28,
    color: '#666666'
  }
});
