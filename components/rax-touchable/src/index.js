import { createElement, PureComponent, PropTypes } from 'rax';
import { isWeb } from 'universal-env';
import View from 'rax-view';

export default class Touchable extends PureComponent {
  static displayName = 'Touchable';

  static propTypes = {
    style: PropTypes.object,
    onPress: PropTypes.func,
  };

  render() {
    const { style = {}, onPress, ...props } = this.props;

    const nativeProps = {
      ...props,
      style: {
        ...styles.container,
        ...style,
      },
    };

    if (onPress) nativeProps.onClick = onPress;

    return <View {...nativeProps} />;
  }
}

const styles = {
  container: isWeb ? {
    cursor: 'pointer',
    webkitTapHighlightColor: 'transparent',
  } : {}
};
