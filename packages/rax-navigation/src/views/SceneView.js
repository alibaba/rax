/* @flow */

import { createElement, PureComponent, PropTypes } from 'rax';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationAction,
} from '../TypeDefinition';

type Props = {
  screenProps?: {};
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>;
  component: ReactClass<*>;
};

export default class SceneView extends PureComponent<void, Props, void> {
  static childContextTypes = {
    navigation: PropTypes.object.isRequired,
  };

  props: Props;

  getChildContext() {
    return {
      navigation: this.props.navigation,
    };
  }

  render() {
    const {
      screenProps,
      navigation,
      component: Component,
    } = this.props;

    return (
      <Component
        screenProps={screenProps}
        navigation={navigation}
      />
    );
  }
}
