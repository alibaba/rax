/* @flow */

import { createElement, PureComponent, PropTypes } from 'rax';
import I18nManager from '../I18nManager';
import Image from 'rax-image';
import Text from 'rax-text';
import View from 'rax-view';
import StyleSheet from 'universal-stylesheet';
import Platform from 'universal-platform';

import type { LayoutEvent } from '../TypeDefinition';

import TouchableItem from './TouchableItem';

const BACK_BUTTON_SOURCE = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAqCAMAAACa7rtRAAAAolBMVEUAAAAAqv8Amf8Akv8AgP8Aif8Ah/8Ahv8Aev8AgP8AfP8AgP8AfP8Aff8Aev8Ae/8Aff8AfP8Afv8AfP8Ae/8Ae/8Ae/8Aev8Ae/8AfP8Ae/8Ae/8AfP8Ae/8Ae/8Ae/8Ae/8Ae/8Aev8Ae/8Aev8Ae/8Ae/8Ae/8Ae/8Aev8Ae/8Aev8Ae/8Aev8Aev8Aev8Ae/8Aev8Aev8Aev8Aev8Aev/LuhVLAAAANXRSTlMAAwUHCg0RFRkeIyQpLzA2PURFTE1VXV5mZ3B6hJ+gqrKzurvCyc/Q1tvc4ebq7vL1+Pr8/lDyQq4AAADlSURBVHjabdTXDoJAFARQC4rYRVHB3rCiIu7//5plNCQzO68n2VzYuVuwpTgPC/aUFsZEVimvzDsTizgb881UpLKF6JHVHeApg7h7SDZkqR0gj4DFO0HSPkvjDLn3WJoXyK3L0k4g1w5L5wpJWizdG+TSZPHvkHOdZZBCjh5L8IAcaiyjDBK7LOETsquyRAbZVlgmP1k7BDltiOhAyTgfQzLMYHsanj5Z0k9hJ0+t9/+9DQK9FPtVttVaXAB7bST1f9l8Ne+oFdViq7kxLBsJ6RLZV0/irPOF5ZSXuub6OGiKs88QL6wEQPGXhneiAAAAAElFTkSuQmCC',
  width: 26,
  height: 42
};

type Props = {
  onPress?: () => void,
  title?: ?string,
  tintColor?: ?string,
  truncatedTitle?: ?string,
  width?: ?number,
};

type DefaultProps = {
  tintColor: ?string,
  truncatedTitle: ?string,
};

type State = {
  initialTextWidth?: number,
};

class HeaderBackButton extends PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string,
    tintColor: PropTypes.string,
    truncatedTitle: PropTypes.string,
    width: PropTypes.number,
  };

  static defaultProps = {
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const { onPress, width, title, tintColor, truncatedTitle } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    return (
      <TouchableItem
        delayPressIn={0}
        onPress={onPress}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          <Image
            source={BACK_BUTTON_SOURCE}
            style={[
              styles.icon,
              title && styles.iconWithTitle,
              { tintColor },
            ]}
          />
          {Platform.OS === 'ios' && title &&
            <Text
              onLayout={this._onTextLayout}
              style={[styles.title, { color: tintColor }]}
              numberOfLines={1}
            >
              {renderTruncated ? truncatedTitle : title}
            </Text>
          }
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 34,
    paddingRight: 20,
  },
  icon: Platform.OS === 'ios'
    ? {
      height: 40,
      width: 24,
      marginLeft: 20,
      marginRight: 44,
      marginTop: 24,
      marginBottom: 24,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
    : {
      height: 48,
      width: 48,
      margin: 32,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  iconWithTitle: Platform.OS === 'ios'
    ? {
      marginRight: 10,
    }
    : {},
});

export default HeaderBackButton;
