import {createElement, Component} from 'rax';
import {isWeex} from 'universal-env';
import View from './View';

class Touchable extends Component {
  render() {
    let props = this.props;
    let nativeProps = {
      ...props,
      style: {
        ...styles.initial,
        ...props.style
      },
      onClick: props.onPress
    };

    delete nativeProps.onPress;

    return <View {...nativeProps} />;
  }
}

const styles = {
  initial: {
    cursor: 'pointer'
  }
};

export default Touchable;
